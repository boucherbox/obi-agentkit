'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Action, ActionProvider as ActionProviderType, ActionContext as ActionContextType } from '../types/actions';

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const [providers, setProviders] = useState<ActionProviderType[]>([]);

  const registerProvider = useCallback((provider: ActionProviderType) => {
    setProviders(prev => [...prev, provider]);
  }, []);

  const unregisterProvider = useCallback((providerName: string) => {
    setProviders(prev => prev.filter(p => p.name !== providerName));
  }, []);

  const executeAction = useCallback(async (action: Action) => {
    const provider = providers.find(p => 
      p.actions.some(a => a.name === action.name)
    );

    if (!provider) {
      throw new Error(`No provider found for action: ${action.name}`);
    }

    return provider.execute(action);
  }, [providers]);

  return (
    <ActionContext.Provider
      value={{
        providers,
        registerProvider,
        unregisterProvider,
        executeAction,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
}

export function useActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useActions must be used within an ActionProvider');
  }
  return context;
} 