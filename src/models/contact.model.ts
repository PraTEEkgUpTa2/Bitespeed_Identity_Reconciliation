import { db } from "../config/database";

export interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const findContactsByEmailOrPhone = async (
  email?: string,
  phoneNumber?: string
): Promise<Contact[]> => {
  const [rows] = await db.query(
    `SELECT * FROM Contact WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL`,
    [email, phoneNumber]
  );
  return rows as Contact[];
};

export const createContact = async (
  email: string | null,
  phoneNumber: string | null,
  linkedId: number | null,
  linkPrecedence: "primary" | "secondary"
): Promise<Contact> => {
  const [result] = await db.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, ?)`,
    [email, phoneNumber, linkedId, linkPrecedence]
  );
  const id = (result as any).insertId;

  const [rows] = await db.query(`SELECT * FROM Contact WHERE id = ?`, [id]);
  return (rows as Contact[])[0];
};

export const findAllRelatedContacts = async (primaryId: number): Promise<Contact[]> => {
    const [rows] = await db.query(
      `SELECT * FROM Contact WHERE (id = ? OR linkedId = ?) AND deletedAt IS NULL`,
      [primaryId, primaryId]
    );
    return rows as Contact[];
  };
  
  export const updateContactLinkage = async (
    contactId: number,
    linkedId: number,
    linkPrecedence: "primary" | "secondary"
  ): Promise<void> => {
    await db.query(
      `UPDATE Contact SET linkedId = ?, linkPrecedence = ?, updatedAt = NOW() WHERE id = ?`,
      [linkedId, linkPrecedence, contactId]
    );
  };