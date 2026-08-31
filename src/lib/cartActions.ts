"use server"

import { products } from "@/data/products";
import type { OrderUnit } from '@/types/cart';
import {readCart, writeCart} from "@/lib/cartStorage"
import { addLine, maxQuantityFor, removeLine, setLineQuantity } from "@/utils/cart"
import type { ProductUnit } from "@/types/product";
import { revalidatePath } from "next/cache";

export async function addToCart(formData: FormData): Promise<void>{
    const productId = formData.get("productId");
    if(typeof productId !== "string"){
        return
    }
    const product = products.find(product => product.id === productId)

    if(!product?.available){
        return
    }

    /** Quantité ajoutée par un clic « Ajouter » : 300 g au poids, 1 pièce sinon. */
    const defaultQuantity: Record<ProductUnit, number>= {
        "kg": 300,
        "piece": 1
    }
    
    const orderUnit: OrderUnit = product.unit === "kg" ? "g" : "piece"

    const lines = await readCart()
    const next =  addLine(
        lines,
        product.id,
        defaultQuantity[product.unit],
        orderUnit,
        maxQuantityFor(product)
    )
    await writeCart(next)

    // Le badge du header vit dans le layout racine : on invalide tout l'arbre.
    revalidatePath("/", "layout")
}
export async function setQuantity(formData: FormData): Promise<void>{
    const productId = formData.get("productId")
    const rawQuantity = formData.get("quantity")
    

    if(typeof productId !== "string" ||
        typeof rawQuantity !== "string"){
        return
    }

    const quantity: number = Number(rawQuantity)

    const product = products.find(product => productId === product.id)

    if(!product){
        return
    }

    const maxQuantity = maxQuantityFor(product)

    const lines = await readCart()
    const next = setLineQuantity(
        lines,
        productId,
        quantity,
        maxQuantity
    )
    await writeCart(next)

    revalidatePath("/", "layout")
}
export async function removeFromCart(formData: FormData): Promise<void>{
    const productId = formData.get("productId");
    if(typeof productId !== "string"){
        return
    }

    const lines = await readCart()
    const next = removeLine(
        lines,
        productId
    )
    await writeCart(next)

    // Le badge du header vit dans le layout racine : on invalide tout l'arbre.
    revalidatePath("/", "layout")
}