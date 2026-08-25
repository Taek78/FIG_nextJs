import ProductGrid from "@/components/ui/ProductGrid";
import { products } from "@/data/products";

export default function ProductPage(){
    return(
        <>
        <div className=" mx-auto px-4 py-8">
            <ProductGrid products={products}/>
        </div>
        
        </>
    )
}