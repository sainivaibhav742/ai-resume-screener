"""
Performance Optimization Module
Implements caching, rate limiting, and performance monitoring
"""

from functools import wraps, lru_cache
from typing import Any, Callable, Dict, Optional
import time
import hashlib
import json
from datetime import datetime, timedelta
from collections import defaultdict, deque
import threading


class CacheManager:
    """In-memory cache with TTL support"""
    
    def __init__(self, default_ttl: int = 3600):
        """
        Initialize cache manager
        
        Args:
            default_ttl: Default time-to-live in seconds (default: 1 hour)
        """
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._default_ttl = default_ttl
        self._lock = threading.Lock()
        self._hits = 0
        self._misses = 0
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        with self._lock:
            if key in self._cache:
                entry = self._cache[key]
                if entry["expires_at"] > time.time():
                    self._hits += 1
                    return entry["value"]
                else:
                    # Expired, remove it
                    del self._cache[key]
            
            self._misses += 1
            return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        ttl = ttl or self._default_ttl
        with self._lock:
            self._cache[key] = {
                "value": value,
                "expires_at": time.time() + ttl,
                "created_at": time.time()
            }
    
    def delete(self, key: str) -> None:
        """Delete key from cache"""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
    
    def clear(self) -> None:
        """Clear entire cache"""
        with self._lock:
            self._cache.clear()
            self._hits = 0
            self._misses = 0
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        with self._lock:
            total_requests = self._hits + self._misses
            hit_rate = (self._hits / total_requests * 100) if total_requests > 0 else 0
            
            return {
                "size": len(self._cache),
                "hits": self._hits,
                "misses": self._misses,
                "hit_rate": round(hit_rate, 2),
                "total_requests": total_requests
            }
    
    def cleanup_expired(self) -> int:
        """Remove expired entries, return count removed"""
        with self._lock:
            current_time = time.time()
            expired_keys = [
                key for key, entry in self._cache.items()
                if entry["expires_at"] <= current_time
            ]
            
            for key in expired_keys:
                del self._cache[key]
            
            return len(expired_keys)


# Global cache instance
cache_manager = CacheManager(default_ttl=3600)  # 1 hour default


def cached(ttl: int = 3600, key_prefix: str = ""):
    """
    Decorator to cache function results
    
    Args:
        ttl: Time-to-live in seconds
        key_prefix: Prefix for cache key
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            key_data = f"{key_prefix}{func.__name__}{str(args)}{str(kwargs)}"
            cache_key = hashlib.md5(key_data.encode()).hexdigest()
            
            # Try to get from cache
            cached_result = cache_manager.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache_manager.set(cache_key, result, ttl)
            
            return result
        
        return wrapper
    return decorator


class RateLimiter:
    """Token bucket rate limiter"""
    
    def __init__(self, requests_per_minute: int = 60):
        """
        Initialize rate limiter
        
        Args:
            requests_per_minute: Maximum requests allowed per minute
        """
        self.requests_per_minute = requests_per_minute
        self.requests_per_second = requests_per_minute / 60
        self._buckets: Dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()
    
    def is_allowed(self, identifier: str) -> bool:
        """
        Check if request is allowed for given identifier
        
        Args:
            identifier: Unique identifier (e.g., user ID, IP address)
            
        Returns:
            True if request is allowed, False otherwise
        """
        with self._lock:
            current_time = time.time()
            window_start = current_time - 60  # 1 minute window
            
            # Get or create bucket for identifier
            bucket = self._buckets[identifier]
            
            # Remove old requests outside window
            while bucket and bucket[0] < window_start:
                bucket.popleft()
            
            # Check if under limit
            if len(bucket) < self.requests_per_minute:
                bucket.append(current_time)
                return True
            
            return False
    
    def get_wait_time(self, identifier: str) -> float:
        """
        Get wait time in seconds before next request is allowed
        
        Args:
            identifier: Unique identifier
            
        Returns:
            Wait time in seconds
        """
        with self._lock:
            bucket = self._buckets[identifier]
            if not bucket or len(bucket) < self.requests_per_minute:
                return 0.0
            
            # Time until oldest request expires from window
            oldest_request = bucket[0]
            current_time = time.time()
            wait_time = 60 - (current_time - oldest_request)
            
            return max(0.0, wait_time)
    
    def reset(self, identifier: str) -> None:
        """Reset rate limit for identifier"""
        with self._lock:
            if identifier in self._buckets:
                del self._buckets[identifier]
    
    def get_stats(self, identifier: str) -> Dict:
        """Get rate limit statistics for identifier"""
        with self._lock:
            bucket = self._buckets[identifier]
            current_time = time.time()
            window_start = current_time - 60
            
            # Clean old requests
            while bucket and bucket[0] < window_start:
                bucket.popleft()
            
            return {
                "requests_in_window": len(bucket),
                "limit": self.requests_per_minute,
                "remaining": self.requests_per_minute - len(bucket),
                "wait_time": self.get_wait_time(identifier)
            }


# Global rate limiter instances
api_rate_limiter = RateLimiter(requests_per_minute=60)
ml_rate_limiter = RateLimiter(requests_per_minute=30)  # Lower limit for ML operations


def rate_limit(limiter: RateLimiter, identifier_func: Optional[Callable] = None):
    """
    Decorator to enforce rate limiting
    
    Args:
        limiter: RateLimiter instance to use
        identifier_func: Function to extract identifier from arguments
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get identifier
            if identifier_func:
                identifier = identifier_func(*args, **kwargs)
            else:
                # Default: use first argument as identifier
                identifier = str(args[0]) if args else "default"
            
            # Check rate limit
            if not limiter.is_allowed(identifier):
                wait_time = limiter.get_wait_time(identifier)
                raise Exception(f"Rate limit exceeded. Try again in {wait_time:.1f} seconds")
            
            return func(*args, **kwargs)
        
        return wrapper
    return decorator


class PerformanceMonitor:
    """Monitor function execution performance"""
    
    def __init__(self):
        self._metrics: Dict[str, Dict] = defaultdict(lambda: {
            "calls": 0,
            "total_time": 0.0,
            "min_time": float('inf'),
            "max_time": 0.0,
            "errors": 0
        })
        self._lock = threading.Lock()
    
    def record(self, func_name: str, execution_time: float, error: bool = False) -> None:
        """Record execution metrics"""
        with self._lock:
            metrics = self._metrics[func_name]
            metrics["calls"] += 1
            metrics["total_time"] += execution_time
            metrics["min_time"] = min(metrics["min_time"], execution_time)
            metrics["max_time"] = max(metrics["max_time"], execution_time)
            if error:
                metrics["errors"] += 1
    
    def get_metrics(self, func_name: Optional[str] = None) -> Dict:
        """Get performance metrics"""
        with self._lock:
            if func_name:
                if func_name in self._metrics:
                    metrics = self._metrics[func_name].copy()
                    if metrics["calls"] > 0:
                        metrics["avg_time"] = metrics["total_time"] / metrics["calls"]
                        metrics["error_rate"] = metrics["errors"] / metrics["calls"] * 100
                    return metrics
                return {}
            else:
                # Return all metrics
                result = {}
                for name, metrics in self._metrics.items():
                    m = metrics.copy()
                    if m["calls"] > 0:
                        m["avg_time"] = m["total_time"] / m["calls"]
                        m["error_rate"] = m["errors"] / m["calls"] * 100
                    result[name] = m
                return result
    
    def reset(self, func_name: Optional[str] = None) -> None:
        """Reset metrics"""
        with self._lock:
            if func_name:
                if func_name in self._metrics:
                    del self._metrics[func_name]
            else:
                self._metrics.clear()


# Global performance monitor
performance_monitor = PerformanceMonitor()


def monitor_performance(func: Callable) -> Callable:
    """Decorator to monitor function performance"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        error_occurred = False
        
        try:
            result = func(*args, **kwargs)
            return result
        except Exception as e:
            error_occurred = True
            raise
        finally:
            execution_time = time.time() - start_time
            performance_monitor.record(func.__name__, execution_time, error_occurred)
    
    return wrapper


class BackgroundJobQueue:
    """Simple background job queue for async processing"""
    
    def __init__(self, max_workers: int = 5):
        """
        Initialize job queue
        
        Args:
            max_workers: Maximum concurrent workers
        """
        self.max_workers = max_workers
        self._queue: deque = deque()
        self._workers: list = []
        self._lock = threading.Lock()
        self._running = False
        self._stats = {
            "total_jobs": 0,
            "completed_jobs": 0,
            "failed_jobs": 0
        }
    
    def start(self) -> None:
        """Start background workers"""
        self._running = True
        for _ in range(self.max_workers):
            worker = threading.Thread(target=self._worker, daemon=True)
            worker.start()
            self._workers.append(worker)
    
    def stop(self) -> None:
        """Stop background workers"""
        self._running = False
        for worker in self._workers:
            worker.join(timeout=5)
        self._workers.clear()
    
    def enqueue(self, func: Callable, *args, **kwargs) -> str:
        """
        Add job to queue
        
        Args:
            func: Function to execute
            *args, **kwargs: Arguments for function
            
        Returns:
            Job ID
        """
        job_id = hashlib.md5(f"{time.time()}{func.__name__}".encode()).hexdigest()
        
        with self._lock:
            self._queue.append({
                "id": job_id,
                "func": func,
                "args": args,
                "kwargs": kwargs,
                "created_at": time.time()
            })
            self._stats["total_jobs"] += 1
        
        return job_id
    
    def _worker(self) -> None:
        """Worker thread to process jobs"""
        while self._running:
            job = None
            
            with self._lock:
                if self._queue:
                    job = self._queue.popleft()
            
            if job:
                try:
                    job["func"](*job["args"], **job["kwargs"])
                    with self._lock:
                        self._stats["completed_jobs"] += 1
                except Exception as e:
                    print(f"Job {job['id']} failed: {str(e)}")
                    with self._lock:
                        self._stats["failed_jobs"] += 1
            else:
                # No jobs, wait a bit
                time.sleep(0.1)
    
    def get_stats(self) -> Dict:
        """Get queue statistics"""
        with self._lock:
            return {
                "queue_size": len(self._queue),
                "workers": len(self._workers),
                **self._stats
            }


# Global background job queue
job_queue = BackgroundJobQueue(max_workers=5)


def background_job(func: Callable) -> Callable:
    """Decorator to run function as background job"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        return job_queue.enqueue(func, *args, **kwargs)
    
    return wrapper


# Database query optimization helpers

def batch_query_optimizer(query_func: Callable, batch_size: int = 100):
    """
    Optimize queries by batching
    
    Args:
        query_func: Function that performs queries
        batch_size: Size of each batch
    """
    @wraps(query_func)
    def wrapper(items: list, *args, **kwargs):
        results = []
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            batch_results = query_func(batch, *args, **kwargs)
            results.extend(batch_results)
        return results
    
    return wrapper


class ConnectionPool:
    """Simple connection pool for database connections"""
    
    def __init__(self, max_connections: int = 10):
        """
        Initialize connection pool
        
        Args:
            max_connections: Maximum number of connections
        """
        self.max_connections = max_connections
        self._connections: deque = deque()
        self._in_use: int = 0
        self._lock = threading.Lock()
    
    def get_connection(self) -> Optional[Any]:
        """Get connection from pool"""
        with self._lock:
            if self._connections:
                self._in_use += 1
                return self._connections.popleft()
            elif self._in_use < self.max_connections:
                # Create new connection (implement based on your DB)
                self._in_use += 1
                return None  # Return actual connection object
            else:
                raise Exception("Connection pool exhausted")
    
    def release_connection(self, connection: Any) -> None:
        """Return connection to pool"""
        with self._lock:
            self._connections.append(connection)
            self._in_use -= 1
    
    def get_stats(self) -> Dict:
        """Get pool statistics"""
        with self._lock:
            return {
                "available": len(self._connections),
                "in_use": self._in_use,
                "max_connections": self.max_connections
            }


# Utility functions

def get_performance_report() -> Dict:
    """Get comprehensive performance report"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "cache": cache_manager.get_stats(),
        "performance": performance_monitor.get_metrics(),
        "job_queue": job_queue.get_stats(),
        "api_rate_limit": {
            "requests_per_minute": api_rate_limiter.requests_per_minute
        },
        "ml_rate_limit": {
            "requests_per_minute": ml_rate_limiter.requests_per_minute
        }
    }


def cleanup_resources() -> Dict:
    """Cleanup expired resources and return stats"""
    cache_expired = cache_manager.cleanup_expired()
    
    return {
        "cache_expired_entries": cache_expired,
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    # Test performance optimization features
    
    # Test caching
    @cached(ttl=60)
    def expensive_operation(x):
        time.sleep(0.1)  # Simulate expensive operation
        return x * 2
    
    # Test rate limiting
    @rate_limit(api_rate_limiter)
    def api_endpoint(user_id):
        return f"Response for {user_id}"
    
    # Test performance monitoring
    @monitor_performance
    def monitored_function(n):
        time.sleep(0.01)
        return sum(range(n))
    
    # Run tests
    print("Testing caching...")
    start = time.time()
    result1 = expensive_operation(5)
    print(f"First call: {time.time() - start:.3f}s")
    
    start = time.time()
    result2 = expensive_operation(5)
    print(f"Cached call: {time.time() - start:.3f}s")
    
    print("\nCache stats:", cache_manager.get_stats())
    
    print("\nTesting performance monitoring...")
    for i in range(5):
        monitored_function(1000)
    
    print("Performance metrics:", performance_monitor.get_metrics("monitored_function"))
    
    print("\nFull performance report:")
    print(json.dumps(get_performance_report(), indent=2))
