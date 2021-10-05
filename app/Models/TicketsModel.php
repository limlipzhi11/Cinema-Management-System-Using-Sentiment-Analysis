<?php

namespace App\Models;

use CodeIgniter\Model;

class TicketsModel extends Model{
    protected $table            = "tickets";
    protected $primaryKey       = "ticket_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'hall_id',
        'showing_id',
        'payment_id',
        'seat_no',
        'price',
        'status',
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>