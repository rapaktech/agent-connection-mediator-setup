import { COMMUNITY_AGENT_API_ENDPOINT, COMMUNITY_AGENT_SERVICE_ENDPOINT } from "./constants/community-agent";
import { MEDIATOR_INVITATION } from "./constants/mediator-agent";
import { createAgent } from "./functions/createAgent";

const run = async () => {
    const { agent } = createAgent() 

    await agent.initialize();

    let { connectionRecord } = await agent.oob.receiveInvitationFromUrl(MEDIATOR_INVITATION);

    if (!connectionRecord) throw new Error("No connection");

    connectionRecord = await agent.connections.returnWhenIsConnected(connectionRecord.id);

    const mediationRecord = await agent.mediationRecipient.provision(connectionRecord);

    await agent.mediationRecipient.setDefaultMediator(mediationRecord)

    await agent.mediationRecipient.pickupMessages(connectionRecord);

    try {
      const credentialOfferInvitation = await fetch(`${COMMUNITY_AGENT_API_ENDPOINT}/issue-credential/create-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            "auto_issue": true,
            "auto-offer": true,
            "auto_remove": true,
            "comment": "string",
            "cred_def_id": "Ehx3RZSV38pn3MYvxtHhbQ:3:CL:689511:default",
            "credential_preview": {
              "@type": "issue-credential/1.0/credential-preview",
              "attributes": [
                {
                  "mime-type": "image/jpeg",
                  "name": "name",
                  "value": "Jim"
                },
                {
                  "mime-type": "image/jpeg",
                  "name": "title",
                  "value": "Developer"
                }
              ]
            },
            "trace": true
          }
        ),
      });

      const invitation = await credentialOfferInvitation.json()

      console.log(invitation)

      const credentialOffer = invitation.credential_offer_dict

      credentialOffer["~service"] = {
        serviceEndpoint: COMMUNITY_AGENT_SERVICE_ENDPOINT,
        routingKeys: [],
        recipientKeys: ['DB4e7UX9N2hjqEADJqiAUg7vDqEFHLH2qVEkBcQhviGg']
      }

      console.log(credentialOffer)

      await agent.receiveMessage(credentialOffer)

      // Wait for process to complete
      await new Promise((resolve) => setTimeout(resolve, 10000))
    } catch (error) {
      console.log(error)
    }
};

run()
