import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastVariant = 'success' | 'error' | 'info';

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<ToastVariant>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (nextMessage: string, nextVariant: ToastVariant = 'info') => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMessage(nextMessage);
      setVariant(nextVariant);

      Animated.timing(opacity, {
        duration: 180,
        toValue: 1,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          duration: 260,
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }, 1500);
    },
    [opacity]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          styles[variant],
          {
            opacity,
            top: insets.top + 14,
          },
        ]}
      >
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast debe usarse dentro de ToastProvider.');
  }
  return value;
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    borderRadius: 12,
    left: 18,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    right: 18,
    zIndex: 999,
  },
  success: {
    backgroundColor: 'rgba(4, 8, 51, 0.92)',
  },
  error: {
    backgroundColor: 'rgba(86, 7, 12, 0.92)',
  },
  info: {
    backgroundColor: 'rgba(11, 29, 58, 0.9)',
  },
  text: {
    color: '#fff9ec',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
});
