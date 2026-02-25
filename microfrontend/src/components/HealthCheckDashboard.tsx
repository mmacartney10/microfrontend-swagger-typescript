import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';

interface HealthCheck {
  endpoint: string;
  name: string;
  status: 'checking' | 'healthy' | 'error';
  responseTime: number | null;
  error?: string;
  lastChecked: Date;
}

const HealthCheckDashboard: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    { endpoint: 'tasks', name: 'Tasks Service', status: 'checking', responseTime: null, lastChecked: new Date() },
    { endpoint: 'products', name: 'Products Service', status: 'checking', responseTime: null, lastChecked: new Date() },
    { endpoint: 'orders', name: 'Orders Service', status: 'checking', responseTime: null, lastChecked: new Date() },
    { endpoint: 'users', name: 'Users Service', status: 'checking', responseTime: null, lastChecked: new Date() },
    { endpoint: 'categories', name: 'Categories Service', status: 'checking', responseTime: null, lastChecked: new Date() },
  ]);

  // Health check queries for each endpoint
  const tasksHealth = useQuery({
    queryKey: ['health-tasks'],
    queryFn: async () => {
      const start = Date.now();
      const result = await apiClient.tasksService.tasksList();
      return { data: result, responseTime: Date.now() - start };
    },
    refetchInterval: 10000, // Check every 10 seconds
  });

  const productsHealth = useQuery({
    queryKey: ['health-products'],
    queryFn: async () => {
      const start = Date.now();
      const result = await apiClient.productsService.productsList();
      return { data: result, responseTime: Date.now() - start };
    },
    refetchInterval: 10000,
  });

  const ordersHealth = useQuery({
    queryKey: ['health-orders'],
    queryFn: async () => {
      const start = Date.now();
      const result = await apiClient.ordersService.ordersList();
      return { data: result, responseTime: Date.now() - start };
    },
    refetchInterval: 10000,
  });

  const usersHealth = useQuery({
    queryKey: ['health-users'],
    queryFn: async () => {
      const start = Date.now();
      const result = await apiClient.usersService.usersList();
      return { data: result, responseTime: Date.now() - start };
    },
    refetchInterval: 10000,
  });

  const categoriesHealth = useQuery({
    queryKey: ['health-categories'],
    queryFn: async () => {
      const start = Date.now();
      const result = await apiClient.categoriesService.categoriesList();
      return { data: result, responseTime: Date.now() - start };
    },
    refetchInterval: 10000,
  });

  // Update health status based on query results
  useEffect(() => {
    const queryResults = [
      { endpoint: 'tasks', query: tasksHealth },
      { endpoint: 'products', query: productsHealth },
      { endpoint: 'orders', query: ordersHealth },
      { endpoint: 'users', query: usersHealth },
      { endpoint: 'categories', query: categoriesHealth },
    ];

    setHealthChecks(prev => 
      prev.map(check => {
        const result = queryResults.find(q => q.endpoint === check.endpoint);
        if (!result) return check;

        const { query } = result;
        
        if (query.isLoading) {
          return { ...check, status: 'checking' as const };
        } else if (query.error) {
          return { 
            ...check, 
            status: 'error' as const, 
            error: query.error.message,
            lastChecked: new Date(),
            responseTime: null
          };
        } else if (query.data) {
          return { 
            ...check, 
            status: 'healthy' as const, 
            responseTime: query.data.responseTime,
            lastChecked: new Date(),
            error: undefined
          };
        }

        return check;
      })
    );
  }, [tasksHealth, productsHealth, ordersHealth, usersHealth, categoriesHealth]);

  const healthyCount = healthChecks.filter(h => h.status === 'healthy').length;
  const errorCount = healthChecks.filter(h => h.status === 'error').length;
  const checkingCount = healthChecks.filter(h => h.status === 'checking').length;

  const overallStatus = errorCount > 0 ? 'degraded' : checkingCount > 0 ? 'checking' : 'healthy';
  
  const avgResponseTime = healthChecks
    .filter(h => h.responseTime !== null)
    .reduce((sum, h) => sum + h.responseTime!, 0) / 
    healthChecks.filter(h => h.responseTime !== null).length || 0;

  const StatusIndicator: React.FC<{ status: string; size?: number }> = ({ status, size = 12 }) => {
    const color = status === 'healthy' ? '#10B981' : status === 'error' ? '#EF4444' : '#F59E0B';
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        animation: status === 'checking' ? 'pulse 2s infinite' : 'none',
      }} />
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <h2>🔍 API Health Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Real-time monitoring of all API endpoints
      </p>

      {/* Overall Status */}
      <div style={{
        backgroundColor: 'white',
        border: `3px solid ${overallStatus === 'healthy' ? '#10B981' : overallStatus === 'error' ? '#EF4444' : '#F59E0B'}`,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
          <StatusIndicator status={overallStatus} size={20} />
          <h3 style={{ margin: '0 0 0 10px', fontSize: '1.5rem' }}>
            System Status: {overallStatus === 'healthy' ? '✅ All Systems Operational' : 
                            overallStatus === 'error' ? '❌ Service Degradation' : '⏳ Checking Services'}
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>{healthyCount}</div>
            <div style={{ color: '#666' }}>Healthy Services</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#EF4444' }}>{errorCount}</div>
            <div style={{ color: '#666' }}>Services with Issues</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>{checkingCount}</div>
            <div style={{ color: '#666' }}>Services Checking</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}>{Math.round(avgResponseTime)}ms</div>
            <div style={{ color: '#666' }}>Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Individual Service Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {healthChecks.map((check) => (
          <div
            key={check.endpoint}
            style={{
              backgroundColor: 'white',
              border: `2px solid ${check.status === 'healthy' ? '#10B981' : check.status === 'error' ? '#EF4444' : '#F59E0B'}`,
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StatusIndicator status={check.status} size={16} />
                <h4 style={{ margin: '0 0 0 10px' }}>{check.name}</h4>
              </div>
              <span style={{
                backgroundColor: check.status === 'healthy' ? '#10B981' : check.status === 'error' ? '#EF4444' : '#F59E0B',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '0.8em',
                textTransform: 'uppercase'
              }}>
                {check.status}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Endpoint:</span>
                <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>
                  /{check.endpoint}
                </code>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Response Time:</span>
                <span style={{ 
                  fontWeight: 'bold',
                  color: check.responseTime === null ? '#666' : 
                         check.responseTime < 200 ? '#10B981' :
                         check.responseTime < 500 ? '#F59E0B' : '#EF4444'
                }}>
                  {check.responseTime === null ? 'N/A' : `${check.responseTime}ms`}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Last Checked:</span>
                <span style={{ fontSize: '0.9em' }}>
                  {check.lastChecked.toLocaleTimeString()}
                </span>
              </div>
            </div>

            {check.error && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '10px'
              }}>
                <strong style={{ color: '#DC2626' }}>Error:</strong>
                <div style={{ color: '#DC2626', fontSize: '0.9em', marginTop: '4px' }}>
                  {check.error}
                </div>
              </div>
            )}

            {check.status === 'healthy' && check.responseTime !== null && (
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '10px'
              }}>
                <div style={{ color: '#166534', fontSize: '0.9em' }}>
                  ✅ Service is responding normally
                  {check.responseTime < 100 && ' with excellent performance'}
                  {check.responseTime >= 100 && check.responseTime < 300 && ' with good performance'}
                  {check.responseTime >= 300 && ' (response time could be improved)'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performance Tips */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '30px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Performance Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ color: avgResponseTime < 200 ? '#10B981' : avgResponseTime < 500 ? '#F59E0B' : '#EF4444' }}>
            <strong>Average Response Time:</strong> {Math.round(avgResponseTime)}ms
            <br />
            <small>
              {avgResponseTime < 200 ? 'Excellent performance' :
               avgResponseTime < 500 ? 'Good performance' :
               'Performance could be improved'}
            </small>
          </div>
          <div style={{ color: errorCount === 0 ? '#10B981' : '#EF4444' }}>
            <strong>Service Reliability:</strong> {((healthyCount / healthChecks.length) * 100).toFixed(1)}%
            <br />
            <small>
              {errorCount === 0 ? 'All services operational' : `${errorCount} service(s) need attention`}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckDashboard;