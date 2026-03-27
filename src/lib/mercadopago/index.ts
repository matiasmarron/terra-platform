import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

function getMpClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  })
}

export function getMpPreference() {
  return new Preference(getMpClient())
}

export function getMpPayment() {
  return new Payment(getMpClient())
}

export const CONSULTATION_PRICE_ARS = 50000
