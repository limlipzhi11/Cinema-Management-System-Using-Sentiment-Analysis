<?php

namespace App\Models;

use CodeIgniter\Model;

class SnackPurchaseModel extends Model{
    protected $table            = "snack_purchase";
    protected $primaryKey       = "id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'snack_id',
        'payment_id',
        'name',
        'qty',
        'price',
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>