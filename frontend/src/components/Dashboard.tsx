"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, TrendingUp, FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardStats {
  totalResumes: number;
  averageScore: number;
  topSkills: { skill: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  weeklyActivity: { week: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalResumes: 247,
        averageScore: 68.5,
        topSkills: [
          { skill: "Python", count: 89 },
          { skill: "JavaScript", count: 76 },
          { skill: "React", count: 65 },
          { skill: "SQL", count: 58 },
          { skill: "Machine Learning", count: 45 },
        ],
        roleDistribution: [
          { role: "Software Engineer", count: 45 },
          { role: "Data Scientist", count: 32 },
          { role: "Product Manager", count: 28 },
          { role: "UX Designer", count: 24 },
          { role: "DevOps Engineer", count: 18 },
        ],
        weeklyActivity: [
          { week: "Week 1", count: 12 },
          { week: "Week 2", count: 18 },
          { week: "Week 3", count: 25 },
          { week: "Week 4", count: 32 },
        ],
        scoreDistribution: [
          { range: "90-100", count: 23 },
          { range: "80-89", count: 45 },
          { range: "70-79", count: 67 },
          { range: "60-69", count: 58 },
          { range: "50-59", count: 34 },
          { range: "0-49", count: 20 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  const skillChartData = {
    labels: stats.topSkills.map(item => item.skill),
    datasets: [{
      label: 'Count',
      data: stats.topSkills.map(item => item.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(147, 51, 234)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
      ],
      borderWidth: 1,
    }],
  };

  const roleChartData = {
    labels: stats.roleDistribution.map(item => item.role),
    datasets: [{
      data: stats.roleDistribution.map(item => item.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 1,
    }],
  };

  const activityChartData = {
    labels: stats.weeklyActivity.map(item => item.week),
    datasets: [{
      label: 'Resumes Processed',
      data: stats.weeklyActivity.map(item => item.count),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }],
  };

  const scoreChartData = {
    labels: stats.scoreDistribution.map(item => item.range),
    datasets: [{
      label: 'Count',
      data: stats.scoreDistribution.map(item => item.count),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h2>
        <p className="text-gray-600">Analytics and insights from resume screening activities</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Resumes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalResumes}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Skill</p>
              <p className="text-xl font-bold text-gray-900">{stats.topSkills[0]?.skill}</p>
              <p className="text-sm text-gray-600">{stats.topSkills[0]?.count} candidates</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.weeklyActivity[stats.weeklyActivity.length - 1]?.count}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Skills */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Skills in Resumes</h3>
          <Bar data={skillChartData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { precision: 0 }
              }
            }
          }} />
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Predicted Role Distribution</h3>
          <Doughnut data={roleChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom' as const,
              },
            },
          }} />
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <Line data={activityChartData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { precision: 0 }
              }
            }
          }} />
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Fit Score Distribution</h3>
          <Bar data={scoreChartData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { precision: 0 }
              }
            }
          }} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { name: "John Doe", role: "Software Engineer", score: 85, time: "2 hours ago" },
            { name: "Jane Smith", role: "Data Scientist", score: 92, time: "4 hours ago" },
            { name: "Mike Johnson", role: "Product Manager", score: 78, time: "1 day ago" },
            { name: "Sarah Wilson", role: "UX Designer", score: 88, time: "1 day ago" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.score >= 80 ? 'bg-green-100 text-green-800' :
                  item.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.score}%
                </div>
                <span className="text-sm text-gray-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
