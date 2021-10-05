<?php

namespace App\Models;

use CodeIgniter\Model;

class ScheduleModel extends Model{
    protected $table            = "schedule";
    protected $primaryKey       = "schedule_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'hall_id',
        'exp_id',
        'start_date',
        'end_date',
        'schedule_by'
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>