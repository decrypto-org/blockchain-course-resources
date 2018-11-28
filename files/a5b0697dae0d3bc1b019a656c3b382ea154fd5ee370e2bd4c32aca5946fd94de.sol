pragma solidity ^0.4.24;


contract DutchAuction {

    //TODO: place your code here

    // Useful modifiers
    modifier biddingOpenOnly {
        require (biddingOpen());
        _;
    }

    modifier biddingClosedOnly {
        require (!biddingOpen());
        _;
    }

    // constructor
    constructor(uint256 initialPrice,
    uint256 biddingPeriod,
    uint256 offerPriceDecrement,
    bool testMode) public {

        _testMode = testMode;
        _creator = msg.sender;

        //TODO: place your code here
    }

    // Return the current price of the listing.
    // This should return 0 if bidding is not open or the auction has been won.
    function currentPrice() public view returns(uint) {
        //TODO: place your code here
    }

    // Return true if bidding is open.
    // If the auction has been won, should return false.
    function biddingOpen() public view returns(bool isOpen) {
        //TODO: place your code here
    }

    // Return the winning bidder, if the auction has been won.
    // Otherwise should return 0.
    function getWinningBidder() public view returns(address winningBidder) {
        //TODO: place your code here
    }


    function bid() public payable biddingOpenOnly {
        //TODO: place your code here
    }


    function finalize() public creatorOnly biddingClosedOnly {
        //TODO: place your code here
    }

    // No need to change any code below here

    uint256 _testTime;
    bool _testMode = false;
    address _creator;

    modifier creatorOnly {
        require(msg.sender == _creator);
        _;
    }

    modifier testOnly {
        require(_testMode);
        _;
    }

    function overrideTime(uint time) public creatorOnly testOnly {
        _testTime = time;
    }

    function clearTime() public creatorOnly testOnly{
        _testTime = 0;
    }

    function getBlockNumber() internal view returns (uint) {
        if (_testTime != 0){
            return _testTime;
        }
        return block.number;
    }
}
