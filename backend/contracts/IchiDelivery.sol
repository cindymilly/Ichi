// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IchiDelivery {
    address public admin;

    struct Order {
        uint256 id;
        address customerWallet;
        uint256 feeAmount;
        bool isCompleted;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderCreated(uint256 id, address customer, uint256 fee);
    event PayoutExecuted(uint256 orderId, address driverWallet, uint256 amount);

    constructor() {
        admin = msg.sender; // Hệ thống backend sẽ là admin
    }

    // Backend gọi hàm này thay mặt khách hàng (sử dụng Custodial Wallet ảo của khách)
    function lockFundsForOrder(uint256 _orderId) public payable {
        require(msg.value > 0, "Phi giao hang phai lon hon 0");
        orders[_orderId] = Order(_orderId, msg.sender, msg.value, false);
        emit OrderCreated(_orderId, msg.sender, msg.value);
    }

    // Khi backend (admin) xác nhận app báo giao hàng thành công -> gọi hàm này
    function releasePayoutToDriver(uint256 _orderId, address payable _driverWeb3Wallet) public {
        require(msg.sender == admin, "Chi he thong (Admin) moi co quyen giai ngan");
        Order storage order = orders[_orderId];
        require(!order.isCompleted, "Don hang nay da duoc quyet toan roi");
        require(order.feeAmount > 0, "Khong tim thay quy tien cua don hang nay");

        order.isCompleted = true;
        
        // Chia tiền (Split Payment): Phí nền tảng 10%, Tài xế nhận 90%
        uint256 platformFee = (order.feeAmount * 10) / 100;
        uint256 driverPayout = order.feeAmount - platformFee;

        // Chuyển tiền NGAY LẬP TỨC thẳng vào ví cá nhân MetaMask của tài xế
        _driverWeb3Wallet.transfer(driverPayout);
        
        emit PayoutExecuted(_orderId, _driverWeb3Wallet, driverPayout);
    }

    // Admin rút doanh thu phí nền tảng
    function withdrawPlatformFees() public {
        require(msg.sender == admin, "Chi Admin");
        payable(admin).transfer(address(this).balance);
    }
}
