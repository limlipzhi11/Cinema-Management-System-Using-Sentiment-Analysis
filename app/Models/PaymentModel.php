<?php

namespace App\Models;

use CodeIgniter\Model;

class PaymentModel extends Model{
    protected $table            = "payment";
    protected $primaryKey       = "payment_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'cust_id',
        'total',
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>