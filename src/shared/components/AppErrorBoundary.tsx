import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('A-Tec startup error', error, errorInfo.componentStack);
  }

  private retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.brand}>A-Tec</Text>
          <Text style={styles.title}>La app encontró un error al iniciar</Text>
          <Text style={styles.subtitle}>
            Esta pantalla ayuda a diagnosticar builds instaladas en Android sin que la app se cierre en silencio.
          </Text>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Detalle técnico</Text>
            <Text style={styles.errorText}>{this.state.error.message || 'Error desconocido'}</Text>
          </View>
          <Pressable style={styles.button} onPress={this.retry}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#040833',
    borderRadius: 14,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fcf4e4',
    fontSize: 15,
    fontWeight: '800',
  },
  brand: {
    color: '#040833',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 18,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  errorBox: {
    backgroundColor: '#fff8eb',
    borderColor: '#56070C',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
    padding: 16,
  },
  errorText: {
    color: '#040833',
    fontSize: 13,
    lineHeight: 19,
  },
  errorTitle: {
    color: '#56070C',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  screen: {
    backgroundColor: '#fcf4e4',
    flex: 1,
  },
  subtitle: {
    color: '#54582F',
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: '#040833',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 10,
  },
});
