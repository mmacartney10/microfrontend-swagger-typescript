import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';

interface LocalSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  language: string;
  pageSize: number;
}

const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Local settings state
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    language: 'en-US',
    pageSize: 10,
  });

  // Fetch app health for connection testing
  const { data: healthData, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['settings-health'],
    queryFn: () => apiClient.tasksService.tasksList(),
    enabled: false, // Only run when manually triggered
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: () => apiClient.tasksService.tasksList(),
    onSuccess: () => {
      alert('✅ Connection test successful!');
    },
    onError: (error) => {
      alert(`❌ Connection test failed: ${error.message}`);
    },
  });

  // Cache management functions
  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      // Clear all React Query cache
      queryClient.clear();
      return Promise.resolve();
    },
    onSuccess: () => {
      alert('🗑️ Cache cleared successfully!');
    },
  });

  const handleLocalSettingChange = (key: keyof LocalSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    // In a real app, you might save this to localStorage or user preferences API
    localStorage.setItem(`microfrontend-setting-${key}`, JSON.stringify(value));
  };

  // Load settings from localStorage on component mount
  React.useEffect(() => {
    const loadSettingsFromStorage = () => {
      const keys: (keyof LocalSettings)[] = ['theme', 'notifications', 'autoRefresh', 'refreshInterval', 'language', 'pageSize'];
      const loadedSettings: Partial<LocalSettings> = {};
      
      keys.forEach(key => {
        const stored = localStorage.getItem(`microfrontend-setting-${key}`);
        if (stored) {
          try {
            loadedSettings[key] = JSON.parse(stored);
          } catch (e) {
            console.warn(`Failed to load setting ${key}:`, e);
          }
        }
      });
      
      setLocalSettings(prev => ({ ...prev, ...loadedSettings }));
    };

    loadSettingsFromStorage();
  }, []);

  const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{
      backgroundColor: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    }}>
      <h3 style={{ marginBottom: '20px', color: '#374151' }}>{title}</h3>
      {children}
    </div>
  );

  const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = 
    ({ label, description, children }) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>{label}</div>
          {description && (
            <div style={{ fontSize: '0.9em', color: '#6b7280' }}>{description}</div>
          )}
        </div>
        <div style={{ marginLeft: '20px' }}>
          {children}
        </div>
      </div>
    );

  return (
    <div style={{ padding: '20px' }}>
      <h2>⚙️ Application Settings</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Configure your microfrontend application preferences and API settings
      </p>

      {/* App Preferences */}
      <SettingSection title="🎨 Appearance & Behavior">
        <SettingRow 
          label="Theme" 
          description="Choose your preferred color scheme"
        >
          <select 
            value={localSettings.theme}
            onChange={(e) => handleLocalSettingChange('theme', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              minWidth: '120px'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">System Default</option>
          </select>
        </SettingRow>

        <SettingRow 
          label="Language" 
          description="Select your preferred language"
        >
          <select 
            value={localSettings.language}
            onChange={(e) => handleLocalSettingChange('language', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              minWidth: '120px'
            }}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
          </select>
        </SettingRow>

        <SettingRow 
          label="Page Size" 
          description="Number of items to show per page in lists"
        >
          <select 
            value={localSettings.pageSize}
            onChange={(e) => handleLocalSettingChange('pageSize', parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              minWidth: '120px'
            }}
          >
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={50}>50 items</option>
          </select>
        </SettingRow>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="🔔 Notifications & Updates">
        <SettingRow 
          label="Enable Notifications" 
          description="Show browser notifications for important updates"
        >
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={localSettings.notifications}
              onChange={(e) => handleLocalSettingChange('notifications', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span>{localSettings.notifications ? 'Enabled' : 'Disabled'}</span>
          </label>
        </SettingRow>

        <SettingRow 
          label="Auto Refresh" 
          description="Automatically refresh data in the background"
        >
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={localSettings.autoRefresh}
              onChange={(e) => handleLocalSettingChange('autoRefresh', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span>{localSettings.autoRefresh ? 'Enabled' : 'Disabled'}</span>
          </label>
        </SettingRow>

        {localSettings.autoRefresh && (
          <SettingRow 
            label="Refresh Interval" 
            description="How often to refresh data automatically"
          >
            <select 
              value={localSettings.refreshInterval}
              onChange={(e) => handleLocalSettingChange('refreshInterval', parseInt(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                minWidth: '120px'
              }}
            >
              <option value={10}>Every 10s</option>
              <option value={30}>Every 30s</option>
              <option value={60}>Every 1min</option>
              <option value={300}>Every 5min</option>
            </select>
          </SettingRow>
        )}
      </SettingSection>

      {/* API & Performance */}
      <SettingSection title="🔧 API & Performance">
        <SettingRow 
          label="Test API Connection" 
          description="Check connectivity to the backend services"
        >
          <button
            onClick={() => testConnectionMutation.mutate()}
            disabled={testConnectionMutation.isPending}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: testConnectionMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: testConnectionMutation.isPending ? 0.7 : 1,
            }}
          >
            {testConnectionMutation.isPending ? 'Testing...' : 'Test Connection'}
          </button>
        </SettingRow>

        <SettingRow 
          label="Clear Cache" 
          description="Remove all cached data and force fresh API calls"
        >
          <button
            onClick={() => clearCacheMutation.mutate()}
            disabled={clearCacheMutation.isPending}
            style={{
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: clearCacheMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: clearCacheMutation.isPending ? 0.7 : 1,
            }}
          >
            {clearCacheMutation.isPending ? 'Clearing...' : 'Clear Cache'}
          </button>
        </SettingRow>
      </SettingSection>

      {/* System Information */}
      <SettingSection title="📊 System Information">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#374151', marginBottom: '10px' }}>Application Info</h4>
            <div style={{ fontSize: '0.9em', color: '#6b7280', lineHeight: '1.6' }}>
              <div><strong>Version:</strong> 1.0.0</div>
              <div><strong>Build:</strong> TypeScript + React</div>
              <div><strong>Module Federation:</strong> Enabled</div>
              <div><strong>API Client:</strong> @swagger-ts/api-client</div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#374151', marginBottom: '10px' }}>Current Settings</h4>
            <div style={{ fontSize: '0.9em', color: '#6b7280', lineHeight: '1.6' }}>
              <div><strong>Theme:</strong> {localSettings.theme}</div>
              <div><strong>Language:</strong> {localSettings.language}</div>
              <div><strong>Notifications:</strong> {localSettings.notifications ? 'On' : 'Off'}</div>
              <div><strong>Auto Refresh:</strong> {localSettings.autoRefresh ? `${localSettings.refreshInterval}s` : 'Off'}</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#374151', marginBottom: '10px' }}>Performance</h4>
            <div style={{ fontSize: '0.9em', color: '#6b7280', lineHeight: '1.6' }}>
              <div><strong>Cache Status:</strong> Active</div>
              <div><strong>Query Retries:</strong> 1</div>
              <div><strong>Stale Time:</strong> 5 minutes</div>
              <div><strong>Page Size:</strong> {localSettings.pageSize} items</div>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Export/Import Settings */}
      <SettingSection title="💾 Backup & Restore">
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const settings = JSON.stringify(localSettings, null, 2);
              const blob = new Blob([settings], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'microfrontend-settings.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            📥 Export Settings
          </button>
          
          <label style={{
            backgroundColor: '#8B5CF6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'inline-block',
          }}>
            📤 Import Settings
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const imported = JSON.parse(e.target?.result as string);
                      setLocalSettings(prev => ({ ...prev, ...imported }));
                      alert('Settings imported successfully!');
                    } catch (err) {
                      alert('Failed to import settings. Please check the file format.');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>
        </div>
      </SettingSection>
    </div>
  );
};

export default SettingsPage;