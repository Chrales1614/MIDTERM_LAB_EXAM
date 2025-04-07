<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        Product::insert([
            [
                'name' => 'MacBook Pro M3',
                'description' => 'The latest MacBook Pro featuring the M3 chip, 16-inch Retina display, and up to 24 hours of battery life.',
                'price' => 2499.99,
                'stock' => 15,
                'image' => 'https://www.albagame.al/cdn/shop/files/render9_9d6707d5-9af6-499c-b435-33a96d5f6025.png?v=1721380266',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Logitech MX Master 3S',
                'description' => 'Premium wireless mouse with ultra-fast scrolling, ergonomic design, and customizable buttons.',
                'price' => 99.99,
                'stock' => 30,
                'image' => 'https://gamextreme.ph/cdn/shop/files/6_684e1916-dabc-48a8-81f3-b7d66cf1069f_1024x1024.jpg?v=1721366816',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
                'price' => 399.99,
                'stock' => 25,
                'image' => 'https://www.sony.com.ph/image/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=pjpeg&wid=220&bgcolor=FFFFFF&bgc=FFFFFF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dell XPS 15',
                'description' => 'Ultra-thin and powerful laptop with InfinityEdge display, Intel Core i9 processor, and NVIDIA graphics.',
                'price' => 1899.99,
                'stock' => 18,
                'image' => 'https://infotekph.com/wp-content/uploads/2023/05/1-3-scaled-e1677767746405.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Apple iPad Pro',
                'description' => '12.9-inch Liquid Retina XDR display, M2 chip, and Apple Pencil support for professional creativity.',
                'price' => 1099.99,
                'stock' => 20,
                'image' => 'https://switch.com.ph/cdn/shop/products/ROSA_iPad_Pro_Cellular_12-9_in_6th_Gen_Space_Gray_PDP_Image_5G_Position-1b.jpg?v=1667032260',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung Galaxy S25 Ultra',
                'description' => 'Flagship smartphone with 200MP camera, 8K video recording, and advanced AI features.',
                'price' => 1299.99,
                'stock' => 22,
                'image' => 'https://images.samsung.com/ph/smartphones/galaxy-s25-ultra/buy/product_color_jetBlack_MO.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ASUS ROG Zephyrus G14',
                'description' => 'Compact gaming laptop with AMD Ryzen 9 processor, RTX 4090 graphics, and 144Hz display.',
                'price' => 2299.99,
                'stock' => 12,
                'image' => 'https://www.gigahertz.com.ph/cdn/shop/files/asus-rog-zephyrus-g14-ga403uv-qs091w-gigahertz-gigahertz-899887.jpg?v=1721109847',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Keychron Q1 Pro',
                'description' => 'Premium mechanical keyboard with customizable RGB lighting, hot-swappable switches, and wireless connectivity.',
                'price' => 199.99,
                'stock' => 35,
                'image' => 'https://www.keychron.uk/cdn/shop/files/Keychron-Q1-Pro-QMK-VIA-custom-mechanical-keyboard-75-percent-layout-PBT-Keycaps-hot-swappable-Keychron-K-Pro-switch-brown-ISO-Swiss-layout.jpg?v=1711871325',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}