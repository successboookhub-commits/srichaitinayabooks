<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the BhashSMS WhatsApp utility API.
 *
 * https://bhashsms.com/api/sendmsgutil.php
 *
 * Credentials/template name are read from config('services.bhashsms.*') —
 * see the services-config-snippet.php for what to add to config/services.php.
 */
class WhatsAppService
{
    protected const ENDPOINT = 'https://bhashsms.com/api/sendmsgutil.php';

    /**
     * Send an order-confirmation WhatsApp message with the invoice PDF
     * attached (via its public URL).
     *
     * @param  string  $phone         Customer's 10-digit mobile number
     * @param  object  $order         Row from the `orders` table (order_code, total, status, ...)
     * @param  string  $invoicePublicUrl  Publicly reachable URL to the invoice PDF
     */
    public static function sendOrderConfirmation(string $phone, $order, string $invoicePublicUrl): bool
    {
        $phone = preg_replace('/\D/', '', $phone); // digits only, e.g. 9620579631

        // NOTE: "Params" feeds the placeholders inside your approved
        // WhatsApp template (the `text` param, e.g. "ord_ch01"). Adjust
        // this list to match whatever variables that template actually
        // expects, and in the same order — check your BhashSMS dashboard
        // for the template's approved variable order.
        $params = implode(',', [
            $order->order_code,
            number_format((float) $order->total, 2),
            $order->status,
            now()->format('d-M-Y'),
        ]);

        $query = [
            'user'     => config('services.bhashsms.user'),
            'pass'     => config('services.bhashsms.pass'),
            'sender'   => config('services.bhashsms.sender'),
            'phone'    => $phone,
            'text'     => config('services.bhashsms.template', 'ord_ch01'),
            'priority' => 'wa',
            'stype'    => 'normal',
            'Params'   => $params,
            'htype'    => 'document',
            'fname'    => 'Invoice ' . $order->order_code,
            'url'      => $invoicePublicUrl,
        ];

        try {
         $response = Http::timeout(8)->get(self::ENDPOINT, $query);

Log::info('BHASHSMS API RESPONSE', [
    'url'      => self::ENDPOINT,
    'query'    => $query,
    'status'   => $response->status(),
    'response' => $response->body(),
]);

return $response->successful();

        } catch (\Throwable $e) {
            Log::error('WhatsApp send failed', [
                'order' => $order->order_code,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
