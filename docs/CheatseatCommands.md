# List of some useful commands
* Generate a transaction event
```
rest -XPOST http://localhost:3000/api/Validation -d "$(cat ValidationD.json)"
```
* Perfom a query for Bank Status Zero
```
rest -XGET http://localhost:3000/api/queries/selectBankStatusZero
```
* Perform a query to get all Status
```
rest -XGET http://location:3000/api/queries/selectBankStatusAll
```
* Create new Bank Participant
```
rest -XPOST http://localhost:3000/api/Bank -d "$(cat BankB.json)"
```
* Create new Customer Participant
```
rest -XPOST http://localhost:3000/api/Customer -d "$(cat CustomerA.json)"
```
* List all Applications
```
rest -XGET http://localhost:3000/api/Application
```
* Create new Application
```
rest -XPOST http://localhost:3000/api/Application -d "$(cat ApplicationA.json)"
```

