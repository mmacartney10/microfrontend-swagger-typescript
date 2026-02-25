import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';

const AnalyticsDashboard: React.FC = () => {
  // Fetch multiple endpoints for dashboard data
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['analytics-tasks'],
    queryFn: () => apiClient.tasksService.tasksList(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['analytics-products'],
    queryFn: () => apiClient.productsService.productsList(),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['analytics-orders'],
    queryFn: () => apiClient.ordersService.ordersList(),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['analytics-users'],
    queryFn: () => apiClient.usersService.usersList(),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['analytics-categories'],
    queryFn: () => apiClient.categoriesService.categoriesList(),
  });

  const isLoading = tasksLoading || productsLoading || ordersLoading || usersLoading || categoriesLoading;

  if (isLoading) return <div style={{ padding: '20px' }}>Loading analytics...</div>;

  // Calculate analytics
  const totalTasks = tasks?.data?.length || 0;
  const completedTasks = tasks?.data?.filter(task => task.completed)?.length || 0;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalProducts = products?.data?.length || 0;
  const activeProducts = products?.data?.filter(product => product.active)?.length || 0;

  const totalOrders = orders?.data?.length || 0;
  const totalRevenue = orders?.data?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

  const totalUsers = users?.data?.length || 0;
  const activeUsers = users?.data?.filter(user => user.active)?.length || 0;

  const totalCategories = categories?.data?.length || 0;
  const activeCategories = categories?.data?.filter(category => category.active)?.length || 0;

  // Get order status distribution
  const orderStatuses = orders?.data?.reduce((acc, order) => {
    acc[order.status || 'unknown'] = (acc[order.status || 'unknown'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Get product categories with product counts
  const categoryStats = categories?.data?.map(category => ({
    name: category.name,
    productCount: category.productCount || 0,
    color: category.color
  })) || [];

  const StatCard: React.FC<{ title: string; value: string | number; color: string; subtitle?: string }> = 
    ({ title, value, color, subtitle }) => (
      <div style={{
        backgroundColor: 'white',
        border: `3px solid ${color}`,
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#666' }}>{title}</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color, margin: '8px 0' }}>
          {value}
        </div>
        {subtitle && (
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#888' }}>{subtitle}</p>
        )}
      </div>
    );

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Analytics Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Overview of all microfrontend data across APIs
      </p>

      {/* Main Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <StatCard 
          title="Total Tasks"
          value={totalTasks}
          color="#3B82F6"
          subtitle={`${taskCompletionRate}% completion rate`}
        />
        <StatCard 
          title="Products"
          value={totalProducts}
          color="#10B981"
          subtitle={`${activeProducts} active products`}
        />
        <StatCard 
          title="Orders"
          value={totalOrders}
          color="#F59E0B"
          subtitle={`$${totalRevenue.toLocaleString()} revenue`}
        />
        <StatCard 
          title="Users"
          value={totalUsers}
          color="#8B5CF6"
          subtitle={`${activeUsers} active users`}
        />
        <StatCard 
          title="Categories"
          value={totalCategories}
          color="#EC4899"
          subtitle={`${activeCategories} active categories`}
        />
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Order Status Chart */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h3 style={{ marginBottom: '20px' }}>Order Status Distribution</h3>
          {Object.entries(orderStatuses).map(([status, count]) => {
            const percentage = Math.round((count / totalOrders) * 100);
            const color = 
              status === 'completed' ? '#10B981' :
              status === 'pending' ? '#F59E0B' :
              status === 'cancelled' ? '#EF4444' :
              status === 'processing' ? '#3B82F6' : '#6B7280';

            return (
              <div key={status} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ textTransform: 'capitalize' }}>{status}</span>
                  <span>{count} ({percentage}%)</span>
                </div>
                <div style={{
                  height: '12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '6px'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories with Product Counts */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h3 style={{ marginBottom: '20px' }}>Category Distribution</h3>
          {categoryStats
            .sort((a, b) => b.productCount - a.productCount)
            .slice(0, 6)
            .map((category) => {
              const maxProducts = Math.max(...categoryStats.map(c => c.productCount));
              const percentage = maxProducts > 0 ? Math.round((category.productCount / maxProducts) * 100) : 0;

              return (
                <div key={category.name} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{category.name}</span>
                    <span>{category.productCount} products</span>
                  </div>
                  <div style={{
                    height: '12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: category.color,
                      borderRadius: '6px'
                    }} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '30px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Quick Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#3B82F6', marginBottom: '10px' }}>📋 Task Status</h4>
            <p>You have {totalTasks - completedTasks} pending tasks out of {totalTasks} total.</p>
          </div>
          <div>
            <h4 style={{ color: '#10B981', marginBottom: '10px' }}>🛍️ Inventory Status</h4>
            <p>{totalProducts - activeProducts} products need attention (inactive).</p>
          </div>
          <div>
            <h4 style={{ color: '#F59E0B', marginBottom: '10px' }}>💰 Sales Overview</h4>
            <p>Average order value: ${totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}</p>
          </div>
          <div>
            <h4 style={{ color: '#8B5CF6', marginBottom: '10px' }}>👥 User Activity</h4>
            <p>{Math.round((activeUsers / totalUsers) * 100)}% of users are currently active.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;