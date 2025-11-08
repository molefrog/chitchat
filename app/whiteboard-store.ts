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
  name: string;
  props: Card[];
}

export interface WhiteboardState {
  clusters: Cluster[];
  caption: string;
  addCard: (card: Card, clusterName?: string) => void;
  updateCard: (cardId: string, updates: Partial<Omit<Card, 'id' | 'type'>>) => void;
  removeCard: (cardId: string) => void;
  removeCluster: (clusterName: string) => void;
  moveCardToCluster: (cardId: string, targetClusterName: string) => void;
  setCaption: (caption: string) => void;
  clearWhiteboard: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  clusters: [
    {
      name: 'Team',
      props: [
        { id: 'alice', type: 'card', color: 'blue', text: 'Alice', tag: null },
        { id: 'bob', type: 'card', color: 'red', text: 'Bob', tag: null },
      ],
    },
    {
      name: 'Management',
      props: [
        { id: 'ceo', type: 'card', color: 'yellow', text: 'CEO', tag: '🔥' },
      ],
    },
    {
      name: 'Engineering',
      props: [
        { id: 'dev1', type: 'card', color: 'green', text: 'Dev1', tag: null },
        { id: 'dev2', type: 'card', color: 'blue', text: 'Dev2', tag: '💡' },
      ],
    },
    {
      name: 'Sales',
      props: [
        { id: 'sales1', type: 'card', color: 'red', text: 'Sales1', tag: null },
      ],
    },
  ],
  caption: '',

  addCard: (card, clusterName = 'default') =>
    set((state) => {
      const clusterIndex = state.clusters.findIndex((c) => c.name === clusterName);
      if (clusterIndex === -1) {
        // Create cluster if it doesn't exist
        return {
          clusters: [
            ...state.clusters,
            { name: clusterName, props: [card] },
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
      const newClusters = state.clusters
        .map((cluster) => ({
          ...cluster,
          props: cluster.props.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          ),
        }))
        .filter((cluster) => cluster.props.length > 0);
      return { clusters: newClusters };
    }),

  removeCard: (cardId) =>
    set((state) => ({
      clusters: state.clusters
        .map((cluster) => ({
          ...cluster,
          props: cluster.props.filter((card) => card.id !== cardId),
        }))
        .filter((cluster) => cluster.props.length > 0),
    })),

  removeCluster: (clusterName) =>
    set((state) => ({
      clusters: state.clusters.filter((cluster) => cluster.name !== clusterName),
    })),

  moveCardToCluster: (cardId, targetClusterName) =>
    set((state) => {
      let cardToMove: Card | null = null;
      const newClusters = state.clusters
        .map((cluster) => {
          const card = cluster.props.find((c) => c.id === cardId);
          if (card) {
            cardToMove = card;
            return {
              ...cluster,
              props: cluster.props.filter((c) => c.id !== cardId),
            };
          }
          return cluster;
        })
        .filter((cluster) => cluster.props.length > 0);

      if (!cardToMove) return state;

      const targetIndex = newClusters.findIndex((c) => c.name === targetClusterName);
      if (targetIndex === -1) return state;

      newClusters[targetIndex] = {
        ...newClusters[targetIndex],
        props: [...newClusters[targetIndex].props, cardToMove],
      };

      return { clusters: newClusters };
    }),

  setCaption: (caption) => set({ caption }),

  clearWhiteboard: () => set({ clusters: [], caption: '' }),
}));
