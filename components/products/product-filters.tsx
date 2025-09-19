"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, X } from "lucide-react"

interface Category {
  id: number
  name: string
  description: string
}

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: number | null
  onCategoryChange: (categoryId: number | null) => void
  organicOnly: boolean
  onOrganicChange: (organic: boolean) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  organicOnly,
  onOrganicChange,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Organic Filter */}
        <div>
          <h4 className="font-medium mb-2">Certification</h4>
          <Button
            variant={organicOnly ? "default" : "outline"}
            size="sm"
            onClick={() => onOrganicChange(!organicOnly)}
            className="w-full justify-start"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Organic Only
          </Button>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(null)}
              className="w-full justify-start"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="w-full justify-start"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== null || organicOnly) && (
          <div>
            <h4 className="font-medium mb-2">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {organicOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Organic
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => onOrganicChange(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => onCategoryChange(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
