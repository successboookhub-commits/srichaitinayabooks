<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice - {{ $order->order_code }}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #000000;
  }
  .outer-card {
    width: 100%;
    border: 2px solid #000000;
    background: #ffffff;
  }
  .inner-card {
    border: none;
    margin: 0;
  }
  /* Section 1: Header */
  .header-box {
    border-bottom: 2px solid #000000;
    background: #ffffff;
    padding: 12px 16px;
  }
  .header-table {
    width: 100%;
    border-collapse: collapse;
  }
  .brand-title {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #000000;
    margin: 0;
    line-height: 1.15;
  }
  .brand-subtitle {
    font-size: 10px;
    font-weight: bold;
    color: #334155;
    margin-top: 4px;
    letter-spacing: 0.4px;
  }
  .badge-box {
    text-align: right;
    vertical-align: middle;
  }
  .badge-pill {
    display: inline-block;
    border: 2px solid #000000;
    background: #ffffff;
    color: #000000;
    font-size: 12.5px;
    font-weight: 900;
    padding: 4px 12px;
    border-radius: 4px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  /* Section 2: Order Strip */
  .order-strip {
    border-bottom: 1.5px solid #000000;
    background: #ffffff;
    padding: 8px 16px;
  }
  .order-table {
    width: 100%;
    border-collapse: collapse;
  }
  .order-code-text {
    font-family: monospace;
    font-size: 16.5px;
    font-weight: 900;
    color: #000000;
    letter-spacing: 0.5px;
  }
  .order-label {
    font-size: 11px;
    font-weight: bold;
    color: #64748b;
    text-transform: uppercase;
    margin-right: 4px;
  }
  .order-date-text {
    text-align: right;
    font-size: 12px;
    font-weight: bold;
    color: #334155;
  }
  /* Section 3: Deliver To */
  .deliver-box {
    border-bottom: 1.5px solid #000000;
    background: #ffffff;
    padding: 13px 16px;
  }
  .tag-table {
    width: 100%;
    border-collapse: collapse;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-bottom: 7px;
  }
  .tag-title {
    font-size: 11.5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #334155;
  }
  .tag-badge {
    text-align: right;
    font-size: 10.5px;
    font-weight: 900;
    text-transform: uppercase;
    color: #475569;
  }
  .tag-pill {
    background: #f1f5f9;
    padding: 2px 7px;
    border-radius: 3px;
  }
  .customer-title {
    font-size: 20px;
    font-weight: 900;
    text-transform: uppercase;
    color: #000000;
    margin: 5px 0 3px 0;
    line-height: 1.25;
    letter-spacing: 0.2px;
  }
  .phone-strip {
    font-size: 15px;
    font-weight: bold;
    color: #000000;
    margin: 5px 0;
  }
  .tel-pill {
    display: inline-block;
    border: 1px solid #000000;
    background: #ffffff;
    color: #000000;
    font-size: 10.5px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 3px;
    margin-right: 6px;
  }
  .tel-num {
    font-family: monospace;
    font-weight: 900;
    letter-spacing: 0.5px;
  }
  .addr-line {
    font-size: 13.5px;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.45;
    margin: 3px 0;
  }
  .pin-table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid #cbd5e1;
    padding-top: 6px;
    margin-top: 8px;
  }
  .pin-title {
    font-size: 12.5px;
    font-weight: 900;
    text-transform: uppercase;
    color: #1e293b;
    letter-spacing: 0.5px;
  }
  .pin-code-num {
    text-align: right;
    font-family: monospace;
    font-size: 20px;
    font-weight: 900;
    color: #000000;
    letter-spacing: 2px;
  }
  /* Section 4: Return Info */
  .return-box {
    border-bottom: 1.5px solid #000000;
    background: #f8fafc;
    padding: 10px 16px;
    font-size: 11px;
    line-height: 1.4;
  }
  .return-top-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4px;
  }
  .return-hdr {
    font-size: 10.5px;
    font-weight: 900;
    text-transform: uppercase;
    color: #475569;
    letter-spacing: 0.5px;
  }
  .reg-pill {
    text-align: right;
    font-size: 10px;
    font-weight: bold;
    color: #1e293b;
  }
  .reg-inner {
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 3px;
  }
  .store-name-text {
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
    color: #000000;
    margin: 2px 0;
  }
  .store-addr-text {
    font-size: 11px;
    color: #1e293b;
    margin: 2px 0;
  }
  .store-phone-text {
    font-size: 11.5px;
    font-weight: bold;
    color: #000000;
    margin-top: 4px;
  }
  /* Section 5: Manifest */
  .manifest-box {
    background: #ffffff;
    padding: 11px 16px;
  }
  .manifest-hdr-table {
    width: 100%;
    border-collapse: collapse;
    border-bottom: 1.5px solid #cbd5e1;
    padding-bottom: 5px;
    margin-bottom: 7px;
  }
  .manifest-title {
    font-size: 11.5px;
    font-weight: 900;
    text-transform: uppercase;
    color: #1e293b;
    letter-spacing: 0.5px;
  }
  .manifest-qty {
    text-align: right;
  }
  .manifest-qty-badge {
    font-family: monospace;
    font-size: 11px;
    font-weight: 900;
    color: #000000;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 3px;
    border: 1px solid #cbd5e1;
  }
  .items-list-table {
    width: 100%;
    border-collapse: collapse;
  }
  .items-list-table td {
    padding: 4.5px 0;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }
  .item-title-td {
    font-size: 12.5px;
    font-weight: bold;
    color: #000000;
    padding-right: 10px;
    line-height: 1.4;
  }
  .item-qty-td {
    text-align: right;
    vertical-align: top;
    width: 45px;
    font-family: monospace;
    font-size: 12px;
    font-weight: 900;
    color: #000000;
    white-space: nowrap;
  }
  }
</style>
</head>
<body>
  @php
    $cust = $order->customer ?? null;
    $custName = strtoupper($cust->name ?? ($order->customer_name ?? 'Customer'));
    $custPhone = $cust->phone ?? ($order->customer_phone ?? '-');
    $pincode = $cust->pincode ?? ($order->pincode ?? '-');
    $badgeText = (($order->status ?? '') === 'Paid') ? 'PREPAID' : 'POSTAL PARCEL';
    $bookingDate = !empty($order->created_at) ? date('d M Y', strtotime($order->created_at)) : date('d M Y');

    $door = trim($cust->door_no ?? ($order->door_no ?? ''));
    $addr = trim($cust->address ?? ($order->address ?? ''));
    $mandal = trim($cust->mandal ?? ($order->mandal ?? ''));
    $district = trim($cust->district ?? ($order->district ?? ''));
    $state = trim($cust->state ?? ($order->state ?? 'Telangana / Andhra Pradesh'));

    $line1 = implode(', ', array_filter([$door ? "D.No: {$door}" : '', $addr]));
    $line2 = implode(', ', array_filter([$mandal, $district]));
    $addressLines = array_filter([$line1, $line2, $state]);

    $totalQty = 0;
    foreach ($items as $it) {
        $totalQty += (int) ($it->qty ?? ($it->quantity ?? 1));
    }
    $itemsCount = count($items) ?: 1;
    $titleWord = ($itemsCount > 1) ? 'TITLES' : 'TITLE';
  @endphp

  <div class="outer-card">
    <div class="inner-card">

      <!-- 1. Header -->
      <div class="header-box">
        <table class="header-table">
          <tr>
            <td>
              <div class="brand-title">SRI CHAITANYA BOOK CENTRE</div>
              <div class="brand-subtitle">ESTD. 1986 | DILSUKHNAGAR, HYDERABAD &bull; COMPETITIVE EXAM BOOKS</div>
            </td>
            <td class="badge-box">
              <span class="badge-pill">{{ $badgeText }}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- 2. Order ID Strip -->
      <div class="order-strip">
        <table class="order-table">
          <tr>
            <td>
              <span class="order-label">ORDER NO:</span>
              <span class="order-code-text">{{ $order->order_code ?? ('ORD' . $order->id) }}</span>
            </td>
            <td class="order-date-text">
              Booking Date: {{ $bookingDate }}
            </td>
          </tr>
        </table>
      </div>

      <!-- 3. Deliver To / Consignee -->
      <div class="deliver-box">
        <table class="tag-table">
          <tr>
            <td class="tag-title">DELIVER TO / SHIP TO:</td>
            <td class="tag-badge"><span class="tag-pill">CONSIGNEE</span></td>
          </tr>
        </table>

        <div class="customer-title">{{ $custName }}</div>

        <div class="phone-strip">
          <span class="tel-pill">TEL / MOB</span>
          <span class="tel-num">{{ $custPhone }}</span>
        </div>

        @foreach ($addressLines as $al)
          <div class="addr-line">{{ ucwords(strtolower($al)) }}</div>
        @endforeach

        <table class="pin-table">
          <tr>
            <td class="pin-title">PIN CODE:</td>
            <td class="pin-code-num">{{ $pincode }}</td>
          </tr>
        </table>
      </div>

      <!-- 4. Dispatch From / Return Info -->
      <div class="return-box">
        <table class="return-top-table">
          <tr>
            <td class="return-hdr">RETURN IF UNDELIVERED TO (BOOK STORE):</td>
            <td class="reg-pill"><span class="reg-inner">Postal Reg ID: 1879696070</span></td>
          </tr>
        </table>
        <div class="store-name-text">SRI CHAITANYA BOOK CENTRE</div>
        <div class="store-addr-text">Konark Theatre Lane, opp. ICICI ATM, Dilsukhnagar, Hyderabad, Telangana - 500060</div>
        <div class="store-phone-text">Helpline / WhatsApp: 09177110134</div>
      </div>

      <!-- 5. Book Description Manifest -->
      <div class="manifest-box">
        <table class="manifest-hdr-table">
          <tr>
            <td class="manifest-title">BOOK DESCRIPTION ({{ $itemsCount }} {{ $titleWord }})</td>
            <td class="manifest-qty"><span class="manifest-qty-badge">TOTAL QTY: {{ $totalQty }}</span></td>
          </tr>
        </table>
        <table class="items-list-table">
          @forelse ($items as $idx => $it)
            @php
              $rawTitle = $it->product_name ?? ($it->book_title ?? ($it->name ?? 'Competitive Examination Book'));
              $cleanTitle = preg_replace('/\.{2,}$/', '', trim($rawTitle));
              $qty = (int) ($it->qty ?? ($it->quantity ?? 1));
            @endphp
            <tr>
              <td class="item-title-td">{{ $idx + 1 }}. {{ $cleanTitle }}</td>
              <td class="item-qty-td">x{{ $qty }}</td>
            </tr>
          @empty
            <tr>
              <td class="item-title-td">1. Sri Chaitanya Competitive Examination Material</td>
              <td class="item-qty-td">x1</td>
            </tr>
          @endforelse
        </table>
      </div>

    </div>
  </div>
</body>
</html>
