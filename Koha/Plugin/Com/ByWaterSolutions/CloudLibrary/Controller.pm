package Koha::Plugin::Com::ByWaterSolutions::CloudLibrary::Controller;

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# This program comes with ABSOLUTELY NO WARRANTY;

use Modern::Perl;

use Koha::Plugin::Com::ByWaterSolutions::CloudLibrary;

use Mojo::Base 'Mojolicious::Controller';
use Mojo::JSON qw(decode_json);
use Encode qw(encode_utf8);

use CGI;
use Try::Tiny;

=head1 Koha::Plugin::Com::ByWaterSolutions::CloudLibrary::Controller
A class implementing the controller code for CloudLibrary requests
=head2 Class methods
=cut

#checkout
#chekin
#place_hold
#cancel_hold
#status get_item_status
#summary get_item_summary
#info item_info
#isbn_info get_isbn_status
#fetch_records

sub get_patron_info {
    my $c = shift->openapi->valid_input or return;
    my $patron = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->get_patron_info( $patron );
        return $c->render(
            status => 200,
            text => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub checkout {
    my $c = shift->openapi->valid_input or return;
    my $item_id   = $c->validation->param('item_id');
    my $patron = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->checkout( $patron, $item_id );
        return $c->render(
            status => 200,
            text   => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub checkin {
    my $c = shift->openapi->valid_input or return;
    my $item_id   = $c->validation->param('item_id');
    my $patron = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->checkin( $patron, $item_id );
        return $c->render(
            status => 200,
            text   => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub place_hold {
    my $c = shift->openapi->valid_input or return;
    my $item_id   = $c->validation->param('item_id');
    my $patron = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->place_hold( $patron, $item_id );
        return $c->render(
            status => 200,
            text   => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub cancel_hold {
    my $c = shift->openapi->valid_input or return;
    my $item_id   = $c->validation->param('item_id');
    my $patron = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->cancel_hold( $patron, $item_id );
        return $c->render(
            status => 200,
            text   => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub get_item_info {
    my $c = shift->openapi->valid_input or return;
    my $item_ids   = $c->validation->param('item_ids');

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->get_item_info( $item_ids );
        return $c->render(
            status => 200,
            text => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub get_item_summary {
    my $c = shift->openapi->valid_input or return;
    my $item_ids   = $c->validation->param('item_ids');

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->get_item_summary( $item_ids );
        return $c->render(
            status => 200,
            text => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub get_isbn_summary {
    my $c = shift->openapi->valid_input or return;
    my $item_ids   = $c->validation->param('item_ids');

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->get_isbn_summary( $item_ids );
        return $c->render(
            status => 200,
            text => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub get_item_status {
    my $c = shift->openapi->valid_input or return;
    my $item_ids   = $c->validation->param('item_ids');
    my $patron = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->get_item_status( $patron, $item_ids );
        return $c->render(
            status => 200,
            text => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}

sub fetch_records {
    my $c = shift->openapi->valid_input or return;
    my $offset      = $c->validation->param('offset');
    my $start_date  = $c->validation->param('start_date');
    my $limit       = $c->validation->param('limit');
    my $patron      = $c->stash('koha.user');

	unless( $patron ){
		return $c->render(
			status => 403,
			error => {"not_signed_in"}
		);
	}

    return try {
        my $plugin   = Koha::Plugin::Com::ByWaterSolutions::CloudLibrary->new();
        my $status = $plugin->fetch_records({
            offset => $offset,
            start_date => $start_date,
            limit => $limit
        });
        return $c->render(
            status => 200,
            text  => $status
        );
    }
    catch {
        return $c->render(
            status  => 500,
            openapi => { error => "Unhandled exception ($_)" }
        );
    };
}
1;
