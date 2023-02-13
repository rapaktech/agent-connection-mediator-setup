import {
    AutoAcceptCredential,
    AutoAcceptProof,
    ConsoleLogger,
    HttpOutboundTransport,
    InitConfig,
    LogLevel,
    WsOutboundTransport,
  } from "@aries-framework/core";
  import { Agent } from "@aries-framework/core";
  import { agentDependencies } from "@aries-framework/node";
  import { GENESIS_BCORVIN_TEST_NET } from "../constants/ledgers";
  
  export const createAgent = () => {
    const value = new Date().toISOString();
    const config: InitConfig = {
      label: `wallet-demo-id-${value}`,
      walletConfig: {
        id: `wallet-demo-id-${value}`,
        key: "testkey0000000000000000000000004",
      },
      autoAcceptConnections: true,
      autoAcceptCredentials: AutoAcceptCredential.Always,
      autoAcceptProofs: AutoAcceptProof.Always,
      logger: new ConsoleLogger(LogLevel.trace),
      indyLedgers: [
        {
          id: "bcovrin-test-net",
          isProduction: false,
          genesisTransactions: GENESIS_BCORVIN_TEST_NET,
          indyNamespace: "bcovrin",
        },
      ],
      autoUpdateStorageOnStartup: true,
    };
  
    const agent = new Agent({ config, dependencies: agentDependencies });
  
    agent.registerOutboundTransport(new HttpOutboundTransport());
    agent.registerOutboundTransport(new WsOutboundTransport());
  
    return { agent, config };
  };
  