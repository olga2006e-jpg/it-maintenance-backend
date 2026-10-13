local pattern = 'session:*'
local keys = redis.call('keys', pattern)
local result = {}
for i, key in ipairs(keys) do
    table.insert(result, key)
    table.insert(result, redis.call('get', key))
    table.insert(result, 'TTL: ' .. redis.call('ttl', key))
end
return result