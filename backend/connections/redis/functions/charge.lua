#!lua name=library_charge

redis.register_function {
    function_name = 'charge',
    callback = function (keys, args)
        local balance = redis.call('GET', keys[1])

        if (balance == nil) then
            return 'false'
        end

        balance = tonumber(balance)
        local charge = tonumber(args[1])

        if (balance >= charge) then
            balance = balance - charge
            redis.call('SET', keys[1], balance)
            return 'true:' .. balance
        end

        return 'false:' .. balance;
    end
}
