<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = Message::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    public function show(Message $message)
    {
        // ✅ FIX: Hapus loadCount(['replies']) karena relationship tidak ada
        // Cukup mark as read lalu kirim message apa adanya
        $message->markAsRead();

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message, // ✅ Simple, no undefined relationship
        ]);
    }

    public function markAsRead(Message $message)
    {
        $message->markAsRead();
        return back()->with('success', 'Pesan ditandai sebagai sudah dibaca.');
    }

    public function markAsUnread(Message $message)
    {
        $message->update(['read_at' => null]);
        return back()->with('success', 'Pesan ditandai sebagai belum dibaca.');
    }


    public function destroy(Message $message)
    {
        $message->delete();
        return back()->with('success', 'Pesan berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:messages,id',
        ]);

        Message::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' pesan berhasil dihapus.');
    }

    public function bulkMarkAsRead(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:messages,id',
        ]);

        Message::whereIn('id', $request->ids)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back()->with('success', count($request->ids) . ' pesan ditandai sebagai sudah dibaca.');
    }

    public function restore(Message $message)
    {
        $message->restore();
        return back()->with('success', 'Pesan berhasil dipulihkan.');
    }

    public function forceDelete(Message $message)
    {
        $message->forceDelete();
        return back()->with('success', 'Pesan berhasil dihapus permanen.');
    }
}
