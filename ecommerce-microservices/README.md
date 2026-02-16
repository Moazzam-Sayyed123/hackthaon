
# E-commerce Microservices POC (Spring Boot + React + Single Postgres, Multi-Schema)

## Stack
- Seller Service: Spring Boot 3, JPA, schema `seller`
- Buyer Service: Spring Boot 3, JPA, schema `buyer`
- DB: Postgres 16 (one DB `appdb`, two schemas)
- UI: React (Vite)
- Gateway: Nginx (serves SPA and proxies `/api/seller/*` and `/api/buyer/*`)

## Run
```bash
docker compose up --build
```
Open http://localhost:8080

- **Products**: manage products (persisted in `seller.products`)
- **Auto Order**: create auto-order rules (persisted in `buyer.auto_order_rules`)

## DB Access
- Host: localhost
- Port: 5433
- DB: appdb
- User: appuser / Pass: apppass
- Schemas: seller, buyer
```sql
select * from seller.products;
select * from buyer.auto_order_rules;
```

## Notes
- POC uses `ddl-auto=update`. For prod, add Flyway and explicit migrations per schema.
- To extend: add Swagger (springdoc), auth (JWT), and a message bus for real price events.
```
