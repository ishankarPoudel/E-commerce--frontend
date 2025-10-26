import { Badge } from "@/ui/shadcn/badge"
import { Button } from "@/ui/shadcn/button"
import { Card, CardContent } from "@/ui/shadcn/card"


interface Product {
  id: number
  name: string
  price: number
  category: string
  brand: string
  color: string
  image: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
}

export function BagCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
            <h3 className="font-medium text-foreground leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-foreground">${product.price}</p>
            <Button
              size="sm"
              variant={product.inStock ? "default" : "secondary"}
              disabled={!product.inStock}
              className="text-xs"
            >
              {product.inStock ? "Add to Cart" : "Notify Me"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
