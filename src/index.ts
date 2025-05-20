import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import {
    createContact,
    findContactsByEmailOrPhone,
    findAllRelatedContacts,
    Contact,
    updateContactLinkage
  } from "../src/models/contact.model";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.post("/identify", async (req: Request, res: Response) : Promise<any> => {
        const { email, phoneNumber } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                message: "Email or phoneNumber is required"
            });
        }

        const existingContacts = await findContactsByEmailOrPhone(email, phoneNumber);

        let primaryContact: Contact | null = null;

        // No existing contacts
        if (existingContacts.length === 0) {
            const newPrimary = await createContact(email || null, phoneNumber || null, null, "primary");
            return res.json({
                contact: {
                    primaryContactId: newPrimary.id,
                    emails: [newPrimary.email].filter(Boolean),
                    phoneNumbers: [newPrimary.phoneNumber].filter(Boolean),
                    secondaryContactIds: [],
                },
            });
        }

        // Existing Contact
        // Oldest primary
        const primaries = existingContacts.filter(c => c.linkPrecedence === "primary");
        primaryContact = primaries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];

        for (const contact of existingContacts) {
            if (contact.id !== primaryContact.id && contact.linkedId !== primaryContact.id) {
              await updateContactLinkage(contact.id, primaryContact.id, "secondary");
            }
          }

        const emailExists = existingContacts.some(c => c.email === email);
        const phoneExists = existingContacts.some(c => c.phoneNumber === phoneNumber);

        if (!emailExists || !phoneExists) {
            await createContact(email || null, phoneNumber || null, primaryContact.id, "secondary");
        }

        const allRelatedContacts = await findAllRelatedContacts(primaryContact.id);

        const uniqueEmails = Array.from(new Set(allRelatedContacts.map(c => c.email).filter(Boolean)));

        const uniquePhones = Array.from(new Set(allRelatedContacts.map(c => c.phoneNumber).filter(Boolean)));

        const secondaryIds = allRelatedContacts
            .filter(c => c.linkPrecedence === "secondary")
            .map(c => c.id);

        return res.json({
            contact: {
                primaryContactId: primaryContact.id,
                emails: uniqueEmails,
                phoneNumbers: uniquePhones,
                secondaryContactIds: secondaryIds,
            },
        });

    });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  });