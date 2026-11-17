<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Shipping Labels ({{ $orders->count() }} Orders)</title>
    <style>
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            margin: 0;
            padding: 10px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
            background: #f8fafc;
        }
        .page-wrapper {
            width: 4.1in;
            margin: 0 auto 20px auto;
        }
        .box {
            border: 2.5px solid #000;
            background: #fff;
            display: flex;
            flex-direction: column;
        }
        /* Top Header */
        .header {
            text-align: center;
            padding: 8px 10px;
            border-bottom: 2px solid #000;
            background: #fff;
        }
        .brand-name {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin: 0 0 2px 0;
            color: #000;
        }
        .shipping-label-title {
            font-size: 14.5px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #000;
        }
        .page-badge {
            font-size: 11.5px;
            font-weight: 700;
            margin-left: 4px;
            letter-spacing: normal;
        }

        /* Sections */
        .section {
            padding: 9px 12px;
            border-bottom: 1.5px solid #000;
        }
        .sec-title {
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 4px;
            color: #111;
            letter-spacing: 0.5px;
        }

        /* TO: Consignee */
        .to-name {
            font-size: 17px;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
            line-height: 1.25;
            margin-bottom: 4px;
        }
        .to-phone {
            font-size: 15.5px;
            font-weight: 900;
            color: #000;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
        }
        .to-address {
            font-size: 13.5px;
            font-weight: 600;
            line-height: 1.45;
            color: #111;
            text-transform: capitalize;
            margin-bottom: 6px;
        }
        .pincode-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dashed #777;
            padding-top: 5px;
            margin-top: 4px;
        }
        .pincode-label {
            font-size: 13.5px;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
        }
        .pincode-num {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #000;
            font-family: monospace, Arial, sans-serif;
        }

        /* FROM: Sender */
        .from-brand {
            font-size: 14.5px;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
            margin-bottom: 2px;
        }
        .from-address {
            font-size: 12.5px;
            font-weight: 500;
            line-height: 1.4;
            color: #111;
        }
        .from-phone {
            font-size: 13.5px;
            font-weight: 900;
            color: #000;
            margin-top: 3px;
        }

        /* Order Info */
        .order-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13.5px;
            line-height: 1.3;
            padding: 8px 12px;
        }
        .order-id-val {
            font-size: 15px;
            font-weight: 900;
            font-family: monospace, Arial, sans-serif;
            color: #000;
        }
        .payment-val {
            font-size: 14px;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
        }

        /* Items Table */
        .items-section {
            padding: 8px 12px;
        }
        .items-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        .items-table th {
            text-align: left;
            border-bottom: 1.5px solid #000;
            padding: 4px 2px;
            font-size: 11.5px;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
        }
        .items-table th.qty-col {
            text-align: center;
            width: 16%;
        }
        .items-table td {
            padding: 5px 2px;
            border-bottom: 1px dashed #999;
            vertical-align: top;
            font-size: 12.5px;
            font-weight: 600;
            line-height: 1.35;
            color: #000;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .items-table td.qty-col {
            text-align: center;
            font-weight: 900;
            font-size: 13.5px;
        }

        /* Footer (NO BARCODE) */
        .footer {
            text-align: center;
            font-size: 12.5px;
            font-weight: 700;
            padding: 9px 0;
            color: #000;
            background: #fff;
        }

        /* Print Controls */
        .no-print-bar {
            text-align: center;
            margin-bottom: 15px;
        }
        .print-btn {
            background: #d32f2f;
            color: #fff;
            border: none;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 800;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        /* Print Mode */
        @media print {
            body {
                background: #fff !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .no-print-bar {
                display: none !important;
            }
            .page-wrapper {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            .page-wrapper:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
            }
            .box {
                border: 2px solid #000 !important;
            }
        }
    </style>
</head>
<body>

    <div class="no-print-bar">
        <button type="button" class="print-btn" onclick="window.print()">🖨️ Print All {{ $orders->count() }} Shipping Labels</button>
    </div>

    @foreach($orders as $order)
        @php
            $rawItems = [];
            if (isset($order->items)) {
                $rawItems = is_array($order->items) ? $order->items : $order->items->all();
            }
            
            // SMART PAGE SPLIT: Page 1 gets up to 5 books with TO/FROM. Page 2+ gets up to 10 books WITHOUT TO/FROM
            $pages = [];
            if (count($rawItems) <= 5) {
                $pages[] = [
                    'isFirstPage' => true,
                    'items' => $rawItems,
                    'startBookNo' => 1,
                ];
            } else {
                $pages[] = [
                    'isFirstPage' => true,
                    'items' => array_slice($rawItems, 0, 5),
                    'startBookNo' => 1,
                ];
                $remaining = array_slice($rawItems, 5);
                $remChunks = array_chunk($remaining, 10);
                foreach ($remChunks as $rIdx => $rChunk) {
                    $pages[] = [
                        'isFirstPage' => false,
                        'items' => $rChunk,
                        'startBookNo' => 6 + ($rIdx * 10),
                    ];
                }
            }
            $totalPages = count($pages);
            $totalItemsCount = count($rawItems);

            // Address resolution
            $cName = $order->customer->name ?? $order->customer_name ?? 'Customer';
            $cPhone = $order->customer->phone ?? $order->customer_phone ?? '-';
            $cDoor = $order->customer->door_no ?? $order->door_no ?? '';
            $cAddr = $order->customer->address ?? $order->address ?? '';
            $cMandal = $order->customer->mandal ?? $order->mandal ?? '';
            $cCity = $order->customer->city ?? $order->city ?? '';
            $cDist = $order->customer->district ?? $order->district ?? '';
            $cState = $order->customer->state ?? $order->state ?? 'Telangana / Andhra Pradesh';
            $cPincode = $order->customer->pincode ?? $order->pincode ?? '';

            $addrParts = [];
            $line1 = array_filter([$cDoor ? ('D.No: ' . $cDoor) : '', $cAddr]);
            if (!empty($line1)) $addrParts[] = implode(', ', $line1);

            $line2 = array_filter([$cMandal, ($cCity && $cCity !== $cMandal) ? $cCity : '', $cDist]);
            if (!empty($line2)) $addrParts[] = implode(', ', $line2);

            $orderCode = $order->order_code ?? ('ORD' . $order->id);
            $orderPayment = $order->status ?? 'Paid';
            if (strtolower($orderPayment) === 'delivered' || strtolower($orderPayment) === 'processing') {
                $orderPayment = 'Paid';
            }
        @endphp

        @foreach($pages as $pIdx => $page)
            @php
                $pageNo = $pIdx + 1;
                $isFirstPage = $page['isFirstPage'];
                $chunkItems = $page['items'];
                $startBookNo = $page['startBookNo'];
                $endBookNo = $startBookNo + count($chunkItems) - 1;
            @endphp
            <div class="page-wrapper">
                <div class="box">
                    <!-- TOP HEADER -->
                    <div class="header">
                        <div class="brand-name">SRI CHAITANYA BOOK CENTRE</div>
                        <div class="shipping-label-title">
                            {{ $isFirstPage ? 'SHIPPING LABEL' : 'ORDER ITEMS MANIFEST (CONTINUED)' }}
                            @if($totalPages > 1)
                                <span class="page-badge">(Page {{ $pageNo }} of {{ $totalPages }})</span>
                            @endif
                        </div>
                    </div>

                    @if($isFirstPage)
                        <!-- TO: CONSIGNEE -->
                        <div class="section">
                            <div class="sec-title">TO:</div>
                            <div class="to-name">{{ $cName }}</div>
                            <div class="to-phone">📞 {{ $cPhone }}</div>
                            <div class="to-address">
                                @foreach($addrParts as $ap)
                                    {{ $ap }}<br>
                                @endforeach
                                {{ $cState }} - {{ $cPincode }}
                            </div>
                        </div>

                        <!-- FROM: SENDER -->
                        <div class="section">
                            <div class="sec-title">FROM:</div>
                            <div class="from-brand">SRI CHAITANYA BOOK CENTRE</div>
                            <div class="from-address">
                                Konark Theatre Ln, opposite ICICI ATM,<br>
                                Gaddiannaram, Madhura Puri Colony,<br>
                                Dilsukhnagar, Hyderabad,<br>
                                Telangana - 500060
                            </div>
                            <div class="from-phone">📞 09177110134</div>
                        </div>

                        <!-- ORDER ID & PAYMENT -->
                        <div class="section order-info">
                            <div><strong>Order ID:</strong> <span class="order-id-val">{{ $orderCode }}</span></div>
                            <div><strong>Payment:</strong> <span class="payment-val">{{ $orderPayment }}</span></div>
                        </div>
                    @else
                        <!-- COMPACT ORDER BAR FOR PAGE 2+ (NO TO/FROM) -->
                        <div class="section order-info" style="background: #f8fafc;">
                            <div><strong>Order ID:</strong> <span class="order-id-val">{{ $orderCode }}</span></div>
                            <div><strong>Customer:</strong> <strong>{{ $cName }}</strong></div>
                            <div><strong>Payment:</strong> <span class="payment-val">{{ $orderPayment }}</span></div>
                        </div>
                    @endif

                    <!-- ITEM DETAILS TABLE -->
                    <div class="section items-section">
                        <div class="items-header-row">
                            <span class="sec-title" style="margin-bottom:0;">
                                {{ $isFirstPage ? 'ITEM DETAILS:' : 'REMAINING ITEMS LIST:' }}
                            </span>
                            @if($totalItemsCount > 0)
                                <span style="font-size:11px; font-weight:800; color:#444;">
                                    (Books {{ $startBookNo }} to {{ $endBookNo }} of {{ $totalItemsCount }})
                                </span>
                            @endif
                        </div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th class="qty-col">QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                                @if(!empty($chunkItems))
                                    @foreach($chunkItems as $itemIndex => $item)
                                        @php
                                            $bookNo = $startBookNo + $itemIndex;
                                            $pName = is_array($item) ? ($item['product_name'] ?? $item['name'] ?? 'Book') : ($item->product_name ?? $item->name ?? 'Book');
                                            $pQty = is_array($item) ? ($item['quantity'] ?? $item['qty'] ?? 1) : ($item->quantity ?? $item->qty ?? 1);
                                        @endphp
                                        <tr>
                                            <td><strong>{{ $bookNo }}.</strong> {{ $pName }}</td>
                                            <td class="qty-col">{{ (int) $pQty }}</td>
                                        </tr>
                                    @endforeach
                                @else
                                    <tr>
                                        <td><strong>1.</strong> Sri Chaitanya Competitive Examination Material</td>
                                        <td class="qty-col">1</td>
                                    </tr>
                                @endif
                            </tbody>
                        </table>
                    </div>

                    <!-- FOOTER (NO BARCODE) -->
                    <div class="footer">
                        Thank you for your order 📦
                    </div>
                </div>
            </div>
        @endforeach
    @endforeach

</body>
</html>
