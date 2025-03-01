// Struttura base per i dati degli utenti
interface StringListData {
  href: string;
  value?: string;
  timestamp: number;
}

interface BaseUserData {
  title: string;
  media_list_data?: any[];  // Opzionale perché non sempre presente
  string_list_data: StringListData[];
}

// Chiavi per i diversi tipi di dati
export type DataKey =
  | 'relationships_blocked_users'
  | 'relationships_close_friends'
  | 'relationships_following'
  | 'relationships_follow_requests_received'
  | 'relationships_follow_requests_sent'
  | 'relationships_unfollowed_users'
  | 'relationships_follow_requests_recent'
  | 'relationships_removed_suggestions'
  | 'relationships_restricted_users';

// Tipi per le diverse liste di utenti
export interface BlockedProfilesData {
  relationships_blocked_users: BaseUserData[];
}

export interface CloseFriendsData {
  relationships_close_friends: BaseUserData[];
}

// Per i followers, il file contiene direttamente un array
export type FollowersData = BaseUserData[];

export interface FollowingData {
  relationships_following: BaseUserData[];
}

export interface ReceivedRequestsData {
  relationships_follow_requests_received: BaseUserData[];
}

export interface PendingRequestsData {
  relationships_follow_requests_sent: BaseUserData[];
}

export interface UnfollowedProfilesData {
  relationships_unfollowed_users: BaseUserData[];
}

export interface RecentFollowRequestsData {
  relationships_follow_requests_recent: BaseUserData[];
}

export interface RemovedSuggestionsData {
  relationships_removed_suggestions: BaseUserData[];
}

export interface RestrictedProfilesData {
  relationships_restricted_users: BaseUserData[];
}

// Tipo generico per un profilo utente
export type InstagramProfile = BaseUserData;

// Tipo per i dati JSON che contengono array di profili
export type ProfilesData = { [K in DataKey]?: BaseUserData[] } | BaseUserData[];

// Funzione helper per estrarre il nome utente da un profilo
export const getUserName = (profile: InstagramProfile): string => {
  if (profile.string_list_data[0]?.value) {
    return profile.string_list_data[0].value;
  }
  return profile.title || 'Utente sconosciuto';
};

// Funzione helper per estrarre la data da un profilo
export const getProfileDate = (profile: InstagramProfile): Date | null => {
  const timestamp = profile.string_list_data[0]?.timestamp;
  return timestamp ? new Date(timestamp * 1000) : null;
};

// Funzione helper per estrarre il link al profilo
export const getProfileLink = (profile: InstagramProfile): string => {
  return profile.string_list_data[0]?.href || '#';
};

// Funzione helper per estrarre i dati da un file JSON
export const extractProfilesFromJson = (
  json: ProfilesData,
  key?: DataKey
): BaseUserData[] => {
  if (Array.isArray(json)) {
    return json;
  }
  return key && json[key] ? json[key]! : [];
}; 