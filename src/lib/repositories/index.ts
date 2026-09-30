/**
 * PABLO Canonical Repository Provider.
 *
 * In this template, data/*.json is the single, authoritative canonical data source.
 * Repositories read and write directly to the JSON store on the server.
 */

export { productsRepository } from "./productsRepository";
export { categoriesRepository } from "./categoriesRepository";
export { collectionsRepository } from "./collectionsRepository";
export { inventoryRepository } from "./inventoryRepository";
export { ordersRepository } from "./ordersRepository";
export { customersRepository } from "./customersRepository";
export { promotionsRepository } from "./promotionsRepository";
export { themesRepository } from "./themesRepository";
export { storefrontRepository } from "./storefrontRepository";
export { mediaRepository } from "./mediaRepository";
export { adminUsersRepository } from "./adminUsersRepository";
export { auditLogsRepository } from "./auditLogsRepository";

export * from "./interfaces";
export * from "./baseJsonStorage";
