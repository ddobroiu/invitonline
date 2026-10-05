import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isContact, validDate, validateEvent, validateGuest, validateRegistration, validateBilling, readJsonObject, eventTemplateData } from '../../src/lib/validation'

const event = { title: 'Ana & Andrei', date: '12 Iulie 2027', location: 'București', type: 'nunta', template: 'boarding' }
test('calendar dates handle leap years and reject impossible days', () => {
    for (const value of ['2028-02-29', '12 Iulie 2027', '12.07.2027']) assert.equal(validDate(value), true)
    for (const value of ['2027-02-29', '31 Aprilie 2027', '2027-13-01', 'mâine', '2027-00-12']) assert.equal(validDate(value), false)
})
test('event rules reject unknown designs, empty fields, malformed values and unsafe links', () => {
    assert.deepEqual(validateEvent(event), {})
    for (const change of [{ title: ' ' }, { date: '31 Februarie 2027' }, { template: 'invalid' }, { type: 'invalid' }, { partyTime: '25:99' }, { locationUrl: 'javascript:alert(1)' }, { photoUrl: {} }, { customFields: [{ label: 'Titlu', value: '' }] }, { age: '-2' }]) assert.ok(Object.keys(validateEvent({ ...event, ...change })).length > 0, JSON.stringify(change))
    assert.deepEqual(validateEvent({ ...event, date: 'Într-o zi de vară', eventDateISO: '2027-07-12' }), {})
})
test('only supported template data survives a save', () => {
    const data = eventTemplateData({ ...event, brideName: ' Ana ', isPaid: true, userId: 'other', arbitrary: { nested: true }, customFields: [{ label: '', value: '' }] })
    assert.deepEqual(data, { brideName: 'Ana', eventType: 'nunta', customFields: [] })
})
test('RSVP accepts email and phone; rejects malformed contacts and fractional head counts', () => {
    for (const value of ['ana@example.com', '+40 722 123 456', '0722-123-456']) assert.equal(isContact(value), true)
    for (const value of ['aaa', '123', 'ana@', 'abc0722123456']) assert.equal(isContact(value), false)
    assert.deepEqual(validateGuest({ name: 'Ana', contact: 'ana@example.com', persons: 2, status: 'confirmed' }), {})
    for (const persons of [0, -1, 1.5, 21, '2']) assert.ok(validateGuest({ name: 'Ana', contact: 'ana@example.com', persons }).persons)
    assert.deepEqual(validateGuest({ name: 'Ana', contact: '', persons: 1 }, false), {})
    assert.ok(validateGuest({ name: ' ', contact: 'x', persons: 1 }).name)
})
test('signup validates types, terms, password and trimmed name', () => {
    const signup = { name: 'Ana', email: 'ana@example.com', password: 'password123', acceptTerms: true }
    assert.equal(validateRegistration(signup), null)
    for (const change of [{ name: ' ' }, { email: {} }, { password: '123' }, { password: {} }, { acceptTerms: 'true' }]) assert.ok(validateRegistration({ ...signup, ...change }))
})
test('malformed JSON and non-object bodies return a validation error', async () => {
    for (const value of ['{', 'null', '[]', '"text"']) await assert.rejects(readJsonObject(new Request('http://localhost', { method: 'POST', body: value })))
})

test('billing accepts optional fields and rejects malformed identifiers and truncation', () => {
    assert.equal(validateBilling({ address: 'Strada Test 12', cui: 'RO12345678' }), null)
    assert.equal(validateBilling({}), null)
    for (const input of [{ cui: 'not-a-cui' }, { city: {} }, { address: 'x'.repeat(301) }]) assert.ok(validateBilling(input))
})
