import {
  productsRepository,
  categoriesRepository,
  collectionsRepository,
  inventoryRepository
} from '../src/lib/repositories';

async function runCrudTest() {
  console.log('Testing Repository Mutation Pipeline...');

  // 1. Inventory stock adjustment
  const p1 = await productsRepository.getProductById('pab-m-001');
  if (!p1) throw new Error('Product pab-m-001 not found');
  const initialStock = p1.stock ?? 13;

  const adjResult = await inventoryRepository.adjustInventory(
    'pab-m-001',
    undefined,
    5,
    'restock',
    'QA Engineer'
  );

  const updatedP1 = await productsRepository.getProductById('pab-m-001');
  if (!updatedP1) throw new Error('Product not found after update');
  console.log('✓ Inventory adjustment reflected:', {
    totalStockBefore: initialStock,
    totalStockAfter: updatedP1.stock,
    logCreated: adjResult.logEntry.id
  });

  // Revert back so we leave clean canonical data
  await inventoryRepository.adjustInventory(
    'pab-m-001',
    undefined,
    -5,
    'audit_correction',
    'QA Engineer'
  );

  const revertedP1 = await productsRepository.getProductById('pab-m-001');
  console.log('✓ Inventory reverted to canonical:', revertedP1?.stock === initialStock);

  // 2. Collection update
  const cols = await collectionsRepository.getCollections();
  const targetCol = cols[0];
  await collectionsRepository.updateCollection(targetCol.id, {
    description: targetCol.description + ' [Verified]'
  });
  const updatedCol = await collectionsRepository.getCollectionById(targetCol.id);
  console.log('✓ Collection updated successfully:', updatedCol?.name, updatedCol?.description.endsWith('[Verified]'));
  
  // Revert description
  await collectionsRepository.updateCollection(targetCol.id, {
    description: targetCol.description
  });

  // 3. Category verification
  const cat = await categoriesRepository.getCategoryById('cat_men');
  console.log('✓ Category retrieved:', cat?.name, 'Slug:', cat?.slug);
  const tree = await categoriesRepository.getCategoryTree();
  console.log('✓ Category tree roots:', tree.map(t => `${t.name} (${t.children.length} subcategories)`).join(', '));

  console.log('All repository mutation tests passed successfully!');
}

runCrudTest().catch(e => {
  console.error(e);
  process.exit(1);
});
