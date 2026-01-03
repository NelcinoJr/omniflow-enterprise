<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-job', function () {
    $data = [
        'task_type' => 'RELATORIO_FINANCEIRO_COMPLEXO',
        'user_email' => 'nelcinojunior1@gmail.com',
        'timestamp' => now()->toIso8601String(),
    ];

    // Publica no canal 'omniflow_channel'
    \Illuminate\Support\Facades\Redis::publish('omniflow_channel', json_encode($data));

    return response()->json([
        'status' => 'Enviado para o Redis!',
        'payload' => $data
    ]);
});


