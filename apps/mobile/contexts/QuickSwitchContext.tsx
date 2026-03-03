/**
 * QuickSwitchContext — Open/close state for the Quick-Switch Sidebar.
 * [TRACE: ROADMAP U. Quick-Switch Sidebar]
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface QuickSwitchContextValue {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const QuickSwitchContext = createContext<QuickSwitchContextValue | null>(null);

export function QuickSwitchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((v) => !v), []);

    return (
        <QuickSwitchContext.Provider value={{ isOpen, open, close, toggle }}>
            {children}
        </QuickSwitchContext.Provider>
    );
}

export function useQuickSwitch() {
    const ctx = useContext(QuickSwitchContext);
    if (!ctx) throw new Error('useQuickSwitch must be used within QuickSwitchProvider');
    return ctx;
}
