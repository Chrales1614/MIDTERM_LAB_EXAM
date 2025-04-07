<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate and retrieve the items from the request
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:carts,id,user_id,' . $user->id,
            'items.*.quantity' => 'required|integer|min:1',
            'address' => 'required|string',
            'contact' => 'required|string',
            'paymentMethod' => 'required|string',
        ]);

        $selectedItems = $request->input('items');
        if (empty($selectedItems)) {
            return response()->json(['message' => 'No items selected for checkout'], 400);
        }

        // Fetch only the selected cart items from the database
        $cartItemIds = array_column($selectedItems, 'id');
        $cartItems = Cart::where('user_id', $user->id)
            ->whereIn('id', $cartItemIds)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Selected items not found in cart'], 400);
        }

        $totalPrice = 0;
        foreach ($cartItems as $item) {
            if (!$item->product || $item->product->stock < $item->quantity) {
                return response()->json(['message' => 'Stock unavailable for ' . $item->product->name], 400);
            }
            $totalPrice += $item->product->price * $item->quantity;
        }

        // Create order with checkout_date and additional fields
        $order = Order::create([
            'user_id' => $user->id,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'checkout_date' => now(), // Set checkout date
            'address' => $request->input('address'),
            'contact' => $request->input('contact'),
            'payment_method' => $request->input('paymentMethod'),
        ]);

        // Add order items and update stock
        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);

            // Reduce stock
            $item->product->stock -= $item->quantity;
            $item->product->save();
        }

        // Remove only the checked-out items from the cart
        Cart::where('user_id', $user->id)
            ->whereIn('id', $cartItemIds)
            ->delete();

        return response()->json(['message' => 'Checkout successful', 'order_id' => $order->id]);
    }

    public function index()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(Order::with('user', 'items.product')->get());
    }

    public function myOrders()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json(Order::where('user_id', $user->id)->with('items.product')->get());
    }

    public function show($id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = Order::with('items.product', 'user')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Ensure items contain product details
        $order->items->each(function ($item) {
            $item->product_name = $item->product->name ?? 'Unknown Product';
        });

        return response()->json($order);
    }

    public function markAsComplete($id)
    {
        $user = Auth::user();

        // Only employees can mark an order as complete
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Find the order
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Update the order status
        $order->status = 'completed';
        $order->save();

        return response()->json(['message' => 'Order marked as complete']);
    }
}