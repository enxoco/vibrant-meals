'use strict'
const Database = use('Database')

/**
 * 
 * The purpose of this module is fetch items from our database and use them
 * to build an object.  This function is mainly used for building the menu
 * items to be displayed on a page.  Since our menu items view is dynamic
 * and depends on a lot of different variables, it made sense to put all that
 * logic here in one reusable function.
 * 
 */
module.exports = async function() {
          // Set up our master list of items, categories and filter relationships
          const item = await Database
          .select('*')
          .from('items')
  
        const categories = await Database
          .select('id', 'desc')
          .table('item_categories')
        
        const filters = await Database
          .select('id', 'name')
          .table('item_filters')
        
        const items_in_categories = await Database
          .select('item_categories.desc AS name')
          .table('items_in_categories')
          .innerJoin('item_categories', 'items_in_categories.category_id', 'item_categories.id')
  
        const itemFilters = await Database
          .select('item_filters.name AS name')
          .table('items_in_filters')
          .innerJoin('item_filters', 'items_in_filters.filter_id', 'item_filters.id')
  
        for (var i = 0; i < item.length; i++) { // Get categories and filters for all items
          const items_in_categories = await Database
            .select('item_categories.desc AS name')
            .table('items_in_categories')
            .innerJoin('item_categories', 'items_in_categories.category_id', 'item_categories.id')
            .where('items_in_categories.item_id', item[i].id)
  
          const itemFilters = await Database
            .select('item_filters.name AS name')
            .table('items_in_filters')
            .innerJoin('item_filters', 'items_in_filters.filter_id', 'item_filters.id')
            .where('items_in_filters.item_id', item[i].id)
  
          item[i].filters = itemFilters
          item[i].categories = items_in_categories
        }
        
        if(items_in_categories && items_in_categories.length != 0) {
          item[0].category = items_in_categories[0].name
        }
  
  
  
        const menu_items = {
          items: item,
          categories: categories,
          filters: filters,
          items_in_categories: items_in_categories,
          itemFilters: itemFilters,
  
        }
        return menu_items
}