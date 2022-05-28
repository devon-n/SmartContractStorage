# Smart Contract Upgrade Practices In Solidity

A few different ways to handle upgrades with smart contracts

Some of the upgrades still allow the previous proxy contract to interact with the older contract. 

This can be overcome by adding a pause variable in the proxy contracts so the contracts cannot be used if they are paused