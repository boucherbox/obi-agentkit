export type ActionType = 'search' | 'execute' | 'navigate' | 'custom';

export interface Action {
  type: ActionType;
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface ActionProvider {
  name: string;
  description: string;
  actions: Action[];
  execute: (action: Action) => Promise<unknown>;
}

export interface ActionContext {
  providers: ActionProvider[];
  registerProvider: (provider: ActionProvider) => void;
  unregisterProvider: (providerName: string) => void;
  executeAction: (action: Action) => Promise<unknown>;
} 