import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput, SafeAreaView } from 'react-native';
import 'reflect-metadata';

import { Model, Field, initialize, insert, findAll } from 'expo-model-kit';

@Model({ tableName: 'tasks' })
class Task {
  @Field({ primaryKey: true, autoIncrement: true, type: 'INTEGER' })
  id?: number;
  
  @Field()
  title: string;
  
  @Field({ nullable: true })
  description?: string;
  
  @Field({ type: 'INTEGER', defaultValue: 0 })
  completed: number;
  
  @Field()
  createdAt: string;
  
  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
    this.completed = 0;
    this.createdAt = new Date().toISOString();
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await initialize();
        console.log('Banco de dados inicializado com sucesso');
        
        await loadTasks();
      } catch (err) {
        console.error('Erro ao inicializar banco de dados:', err);
        setError('Falha ao inicializar o banco de dados');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDb();
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await findAll<Task>(Task);
      setTasks(loadedTasks);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      setError('Falha ao carregar as tarefas');
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      setError('Título da tarefa não pode ser vazio');
      return;
    }

    try {
      setError(null);
      
      const taskId = await insert(Task, {
        title: newTaskTitle,
        description: newTaskDescription.trim() || undefined,
        completed: 0,
        createdAt: new Date().toISOString()
      });
      
      console.log(`Tarefa inserida com ID: ${taskId}`);
      
      setNewTaskTitle('');
      setNewTaskDescription('');
      
      await loadTasks();
    } catch (err) {
      console.error('Erro ao inserir tarefa:', err);
      setError('Falha ao adicionar a tarefa');
    }
  };

  const renderTaskItem = (task: Task) => {
    return (
      <View key={task.id} style={styles.taskItem}>
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
            task.completed === 1 && styles.completedTask
          ]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.taskDescription}>{task.description}</Text>
          ) : null}
          <Text style={styles.taskDate}>
            Criado em: {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Inicializando banco de dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Tarefas</Text>
        <Text style={styles.headerSubtitle}>
          Usando @rapaduralabs/expo-model-kit
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título da tarefa"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição (opcional)"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          multiline
          numberOfLines={3}
        />
        <Button title="Adicionar Tarefa" onPress={addTask} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.taskList}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyListMessage}>
            Nenhuma tarefa encontrada. Adicione sua primeira tarefa!
          </Text>
        ) : (
          tasks.map(renderTaskItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
  },
  emptyListMessage: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  },
});
