<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
//use Illuminate\Foundation\Auth\RegistersUsers;
class AuthController extends Controller
{
    // REGISTER FUNCTION
    public function register(Request $request)
    {
        // Validate the incoming request to ensure that the user provides valid data
        $request->validate([
            'name' => 'required|string|max:255', // 'name' is required and must be a string with a max length of 255 characters
            'email' => 'required|string|email|max:255|unique:users', // 'email' is required, must be a valid email, and must be unique in the 'users' table
            'password' => 'required|string|min:6', // 'password' is required and must be at least 6 characters long
            'role' => 'required|in:customer,admin' // 'role' is required and must be either 'customer' or 'employee'
        ]);

        // Create a new user record in the database with the validated data
        $user = User::create([
            'name' => $request->name, // Assign the 'name' field from the request
            'email' => $request->email, // Assign the 'email' field from the request
            'password' => Hash::make($request->password), // Hash the password before storing it
            'role' => $request->role // Assign the 'role' field from the request
        ]);

        // Generate an API token for the newly registered user
        $token = $user->createToken('API Token')->plainTextToken;

        // Return a success response with the user data and the generated token
        return response()->json([
            'message' => 'User registered successfully', // Confirmation message
            'user' => $user, // Return user data
            'token' => $token // Return the generated token
        ], 201); // Return HTTP status code 201 (Created)
    }

    // LOGIN FUNCTION
    public function login(Request $request)
    {
        // Validate the incoming request to ensure that the user provides valid data
        $request->validate([
            'email' => 'required|string|email', // 'email' is required and must be a valid email
            'password' => 'required|string' // 'password' is required
        ]);

        // Attempt to authenticate the user with the provided credentials
        if (!Auth::attempt($request->only('email', 'password'))) {
            // If authentication fails, throw a validation exception with a custom error message
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'] // Custom error message for incorrect credentials
            ]);
        }

        // If authentication is successful, retrieve the authenticated user
        $user = Auth::user();

        // Generate an API token for the authenticated user
        $token = $user->createToken('API Token')->plainTextToken;

        // Return a success response with the user data and the generated token
        return response()->json([
            'message' => 'Login successful', // Confirmation message
            'user' => $user, // Return user data
            'token' => $token // Return the generated token
        ], 200); // Return HTTP status code 200 (OK)
    }

    // LOGOUT FUNCTION
    public function logout(Request $request)
    {
        // Delete all tokens associated with the authenticated user to log them out
        $request->user()->tokens()->delete();

        // Return a success response to confirm the user has been logged out
        return response()->json([
            'message' => 'Logged out successfully' // Confirmation message
        ]);
    }
}
