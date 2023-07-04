import {expect, test} from '@oclif/test'
import {describe} from "node:test";

describe('mycommand', () => {
    test
        .command(['aspect-tool:MyCommand'])
        .it('shows user email when logged in', ctx => {
            expect(ctx.stdout).to.equal('jeff@example.com\n')
        })
});
