import { PrismaClient } from '../../prisma/generated/prisma/client'
import { fieldEncryptionExtension } from 'prisma-field-encryption'

const prisma = new PrismaClient()

// Add encryption extension
prisma.$extends(fieldEncryptionExtension())

export default prisma
