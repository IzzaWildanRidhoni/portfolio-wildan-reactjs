<?php
// app/Models/SocialLink.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SocialLink extends Model
{
    protected $fillable = [
        'platform',
        'label',
        'description',
        'url',
        'icon_class',
        'gradient',
        'is_active',
        'sort_order',
        'is_full_width',
        'button_text',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_full_width' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Scope: hanya yang aktif, urut berdasarkan sort_order
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    // Scope: full width cards (email)
    public function scopeFullWidth(Builder $query): Builder
    {
        return $query->where('is_full_width', true);
    }

    // Scope: grid cards (instagram, github, etc)
    public function scopeGridCards(Builder $query): Builder
    {
        return $query->where('is_full_width', false);
    }

    // Helper: format URL untuk email
    public static function formatEmailUrl(string $email): string
    {
        return 'mailto:' . $email;
    }

    // Helper: format URL untuk WhatsApp
    public static function formatWhatsappUrl(string $number): string
    {
        $clean = preg_replace('/[^0-9]/', '', $number);
        return 'https://wa.me/' . $clean;
    }

    // Get icon component name for React
    public function getReactIconNameAttribute(): string
    {
        $icons = [
            'email' => 'email',
            'instagram' => 'instagram',
            'linkedin' => 'linkedin',
            'github' => 'github',
            'tiktok' => 'tiktok',
            'whatsapp' => 'whatsapp',
        ];
        return $icons[$this->platform] ?? 'email';
    }

    // Transform to frontend format
    public function toFrontendFormat(): array
    {
        return [
            'id' => $this->platform,
            'label' => $this->label,
            'desc' => $this->description,
            'action' => $this->button_text ?? "Pergi ke {$this->platform}",
            'href' => $this->url,
            'full' => $this->is_full_width,
            'gradient' => $this->gradient ?? $this->getDefaultGradient(),
            'icon' => $this->react_icon_name,
        ];
    }

    // Default gradients jika tidak di-set
    private function getDefaultGradient(): string
    {
        $gradients = [
            'email' => 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
            'instagram' => 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            'linkedin' => 'linear-gradient(135deg, #0277bd 0%, #01579b 100%)',
            'github' => 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
            'tiktok' => 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
            'whatsapp' => 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
        ];
        return $gradients[$this->platform] ?? 'linear-gradient(135deg, #666 0%, #333 100%)';
    }
}
