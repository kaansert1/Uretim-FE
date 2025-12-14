import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useEmployee } from "@/store/features/employee";
import ToastHelper from "@/utils/helpers/ToastHelper";

interface ISignalRContext {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
  invoke: <T>(methodName: string, ...args: any[]) => Promise<T>;
  on: (methodName: string, callback: (...args: any[]) => void) => void;
  off: (methodName: string, callback: (...args: any[]) => void) => void;
}

const SignalRContext = createContext<ISignalRContext | undefined>(undefined);

interface IProps {
  children: React.ReactNode;
}

export const SignalRProvider: React.FC<IProps> = ({ children }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const { machine } = useEmployee();

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://192.168.2.251:5510/chat", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection && machine) {
      startConnection();
    }
  }, [connection, machine]);

  const startConnection = async () => {
    try {
      if (connection) {
        await connection.start();
        setIsConnected(true);
        console.log("SignalR Bağlantısı Başarılı");

        // Bağlantı başarılı olduktan sonra makine kodunu gönder
        await connection.invoke("Connect", machine?.machineCode);
      }
    } catch (err: Error | any) {
      console.error("SignalR Bağlantı Hatası:", err);
      ToastHelper.error("SignalR Bağlantı Hatası: " + err.message);
      setIsConnected(false);
      setTimeout(startConnection, 5000);
    }
  };

  const stopConnection = async () => {
    try {
      if (connection) {
        await connection.stop();
        setIsConnected(false);
        console.log("SignalR Bağlantısı Kapatıldı");
      }
    } catch (err: Error | any) {
      console.error("SignalR Bağlantı Kapatma Hatası:", err);
      ToastHelper.error("SignalR Bağlantı Kapatma Hatası: " + err.message);
    }
  };

  const invoke = async <T,>(methodName: string, ...args: any[]): Promise<T> => {
    if (!connection) {
      throw new Error("SignalR bağlantısı bulunamadı");
    }
    return await connection.invoke<T>(methodName, ...args);
  };

  const on = (methodName: string, callback: (...args: any[]) => void) => {
    if (connection) {
      connection.on(methodName, callback);
    }
  };

  const off = (methodName: string, callback: (...args: any[]) => void) => {
    if (connection) {
      connection.off(methodName, callback);
    }
  };

  const contextValue: ISignalRContext = {
    connection,
    isConnected,
    startConnection,
    stopConnection,
    invoke,
    on,
    off,
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalR hook'u SignalRProvider içinde kullanılmalıdır");
  }
  return context;
};
