import React from "react";
import { motion } from "framer-motion";
import { Coffee, Cocktail, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CafeBarUI() {
  const menu = [
    { id: 1, name: "Café Espresso", price: 5000, icon: <Coffee /> },
    { id: 2, name: "Capuchino Especial", price: 7000, icon: <Coffee /> },
    { id: 3, name: "Mojito Clásico", price: 15000, icon: <Cocktail /> },
    { id: 4, name: "Piña Colada", price: 18000, icon: <Cocktail /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Café Bar</h1>
        <Button className="rounded-2xl px-5 py-2 text-lg flex gap-2">
          <ShoppingCart /> Pedido
        </Button>
      </header>

      {/* Menu */}
      <h2 className="text-2xl mb-4 font-semibold">Menú</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-neutral-800 border-none rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <div className="text-5xl">{item.icon}</div>
                <p className="text-xl font-semibold">{item.name}</p>
                <p className="text-lg text-gray-300">$ {item.price.toLocaleString()}</p>
                <Button className="rounded-xl mt-2 w-full">Agregar</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Coffee, Cocktail, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CafeBarUI() {
  const menu = [
    { id: 1, name: "Café Espresso", price: 5000, icon: <Coffee /> },
    { id: 2, name: "Capuchino Especial", price: 7000, icon: <Coffee /> },
    { id: 3, name: "Mojito Clásico", price: 15000, icon: <Cocktail /> },
    { id: 4, name: "Piña Colada", price: 18000, icon: <Cocktail /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Café Bar</h1>
        <Button className="rounded-2xl px-5 py-2 text-lg flex gap-2">
          <ShoppingCart /> Pedido
        </Button>
      </header>

      {/* Menu */}
      <h2 className="text-2xl mb-4 font-semibold">Menú</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-neutral-800 border-none rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <div className="text-5xl">{item.icon}</div>
                <p className="text-xl font-semibold">{item.name}</p>
                <p className="text-lg text-gray-300">$ {item.price.toLocaleString()}</p>
                <Button className="rounded-xl mt-2 w-full">Agregar</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
