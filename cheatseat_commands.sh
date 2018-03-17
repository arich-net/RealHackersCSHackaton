# List of some useful commands
# List all Applications
rest -XGET http://localhost:3000/api/Application
# Generate a transaction event
rest -XPOST http://localhost:3000/api/Validation -d "$(cat ValidationD.json)"
# Perfom a query for Bank Status Zero
rest -XGET http://localhost:3000/api/queries/selectBankStatusZero
# Perform a query to get all Status
rest -XGET http://location:3000/api/queries/selectBankStatusAll

