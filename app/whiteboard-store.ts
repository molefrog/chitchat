import { create } from 'zustand';

export type CardColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Card {
  id: string;
  type: 'card';
  color: CardColor;
  text: string;
  tag?: string | null;
}

export interface Cluster {
  id: string;
  label?: string;
  props: Card[];
}

export interface WhiteboardState {
  clusters: Cluster[];
  addCard: (card: Card, clusterId?: string) => void;
  updateCard: (cardId: string, updates: Partial<Omit<Card, 'id' | 'type'>>) => void;
  removeCard: (cardId: string) => void;
  removeCluster: (clusterId: string) => void;
  moveCardToCluster: (cardId: string, targetClusterId: string) => void;
  clearWhiteboard: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  clusters: [
    {
      id: 'team',
      label: 'Team',
      props: [
        { id: 'alice', type: 'card', color: 'blue', text: 'Alice', tag: null },
        { id: 'bob', type: 'card', color: 'red', text: 'Bob', tag: null },
      ],
    },
    {
      id: 'management',
      label: 'Management',
      props: [
        { id: 'ceo', type: 'card', color: 'yellow', text: 'CEO', tag: '🔥' },
      ],
    },
    {
      id: 'engineering',
      label: 'Engineering',
      props: [
        { id: 'dev1', type: 'card', color: 'green', text: 'Dev1', tag: null },
        { id: 'dev2', type: 'card', color: 'blue', text: 'Dev2', tag: '💡' },
      ],
    },
    {
      id: 'sales',
      label: 'Sales',
      props: [
        { id: 'sales1', type: 'card', color: 'red', text: 'Sales1', tag: null },
      ],
    },
  ],

  addCard: (card, clusterId = 'default') =>
    set((state) => {
      const clusterIndex = state.clusters.findIndex((c) => c.id === clusterId);
      if (clusterIndex === -1) {
        // Create default cluster if it doesn't exist
        return {
          clusters: [
            ...state.clusters,
            { id: 'default', props: [card] },
          ],
        };
      }

      const newClusters = [...state.clusters];
      newClusters[clusterIndex] = {
        ...newClusters[clusterIndex],
        props: [...newClusters[clusterIndex].props, card],
      };
      return { clusters: newClusters };
    }),

  updateCard: (cardId, updates) =>
    set((state) => {
      const newClusters = state.clusters.map((cluster) => ({
        ...cluster,
        props: cluster.props.map((card) =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }));
      return { clusters: newClusters };
    }),

  removeCard: (cardId) =>
    set((state) => ({
      clusters: state.clusters.map((cluster) => ({
        ...cluster,
        props: cluster.props.filter((card) => card.id !== cardId),
      })),
    })),

  removeCluster: (clusterId) =>
    set((state) => ({
      clusters: state.clusters.filter((cluster) => cluster.id !== clusterId),
    })),

  moveCardToCluster: (cardId, targetClusterId) =>
    set((state) => {
      let cardToMove: Card | null = null;
      const newClusters = state.clusters.map((cluster) => {
        const card = cluster.props.find((c) => c.id === cardId);
        if (card) {
          cardToMove = card;
          return {
            ...cluster,
            props: cluster.props.filter((c) => c.id !== cardId),
          };
        }
        return cluster;
      });

      if (!cardToMove) return state;

      const targetIndex = newClusters.findIndex((c) => c.id === targetClusterId);
      if (targetIndex === -1) return state;

      newClusters[targetIndex] = {
        ...newClusters[targetIndex],
        props: [...newClusters[targetIndex].props, cardToMove],
      };

      return { clusters: newClusters };
    }),

  clearWhiteboard: () => set({ clusters: [] }),
}));
