import { create } from 'zustand'

const useVideoStore = create((set, get) => ({
    videos: [],
    channelNames: [],
    selectedChannel : '',
    selectedCountry: '',
    isSidebarOpen: false,
    dateRange: [null, null],
    selectedVideo: null,
    open: false,
    selectedVideoId: null,
    searchTerm: '',
    isMobile: window.innerWidth < 768,
    isAuthenticated : false,
    setIsAuthenticated : (value) => set({ isAuthenticated: value }),
    setIsMobile: (value) => set({ isMobile: value }),

    updateIsMobile: () => {
        set({ isMobile: window.innerWidth < 768 });
    },

    setSearchTerm: (term) => set({ searchTerm: term }),
    setSelectedVideoId: (id) => set({ selectedVideoId: id }),
    handleClose: () => set({ open: false, selectedVideo: null }),
    handleOpen: (video) => set({ selectedVideo: video, open: true }),

    setOpen: (open) => set({ open }),
    setSelectedVideo: (video) => set({ selectedVideo: video }),
    setDateRange: (range) => set({ dateRange: range }),
    setVideos: (videos) => set({ videos }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSelectedChannel : (channel) => set({ selectedChannel: channel }),
    setSelectedCountry : (country) => set({ selectedCountry: country })
}));

export default useVideoStore;